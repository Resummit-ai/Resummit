"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { Download, GripVertical, Plus, Trash2, RotateCcw, Link as LinkIcon, CheckCircle2, Activity, Eye, Sparkles, Target, X, Loader2, User, Briefcase, Code2, GraduationCap, Zap, AlertTriangle, AlertCircle, ChevronDown, ChevronUp, Save, Wifi, WifiOff, ArrowUp, ArrowDown, ExternalLink, Rocket, Cpu, Code, Terminal, GitBranch, Lock, Sun, Moon, RefreshCw, History, FileText, ArrowLeft, ChevronRight, Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, ChevronLeft } from "lucide-react";
import type { CVData, ProjectData, CVSkills, CVExperience, CVEducation, SaveStatus, EditorTab } from "@/lib/types";
import { ResumePreview } from "@/components/editor/ResumePreview";
import { normalizeAndDedupeSkills } from "@/lib/skills-data";
import { DashboardControls } from "@/components/dashboard/DashboardControls";

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function InlineEdit({
  value,
  onChange,
  placeholder,
  className = "",
  multiline = false,
  rows = 3,
  icon,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
  multiline?: boolean;
  rows?: number;
  icon?: React.ReactNode;
}) {
  if (multiline) {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-white dark:bg-neutral-800 border border-[#DADCE0] dark:border-neutral-700 rounded-lg px-3.5 py-2.5 text-[13px] text-[#202124] dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15 transition-all resize-none leading-relaxed font-normal ${className}`}
      />
    );
  }
  return (
    <div className="relative flex items-center w-full">
      {icon && (
        <div className="absolute left-3 flex items-center pointer-events-none text-neutral-500 z-10">
          {icon}
        </div>
      )}
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white dark:bg-neutral-800 border border-[#DADCE0] dark:border-neutral-700 rounded-lg ${icon ? "pl-9" : "px-3.5"} py-2 text-[13px] text-[#202124] dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15 transition-all font-normal ${className}`}
      />
    </div>
  );
}

function parseAchievementString(str: string) {
  if (!str) return { title: "", date: "", url: "" };
  const trimmed = str.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      return {
        title: parsed.title || "",
        date: parsed.date || "",
        url: parsed.url ? parsed.url.trim() : "",
      };
    } catch {
      // fall through to legacy regex
    }
  }
  const urlRegex = /(https?:\/\/[^\s]+|(?:credly\.com|coursera\.org|github\.com|linkedin\.com|devpost\.com)\S+)/gi;
  let url = "";
  const urlMatch = str.match(urlRegex);
  if (urlMatch) url = urlMatch[0];
  let tempStr = str.replace(urlRegex, "").trim();
  const dateRegex = /\(([^)]*(?:\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b)[^)]*)\)/i;
  let date = "";
  const dateMatch = tempStr.match(dateRegex);
  if (dateMatch) date = dateMatch[1];
  let title = tempStr.replace(dateRegex, "").replace(/\s*[-–—:]\s*$/, "").trim();
  return { title, date, url };
}

function SkillTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[var(--sclade-subtle-bg)] border border-[var(--sclade-border)] text-[var(--sclade-text-primary)] px-2.5 py-1 rounded-md text-[12px] font-medium group hover:border-[var(--sclade-primary)] transition-all cursor-default">
      {label}
      <button
        onClick={onRemove}
        className="text-[var(--sclade-text-muted)] hover:text-red-500 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function SectionLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[12px] font-semibold text-[#5F6368] dark:text-neutral-300 mb-1.5 ml-0.5">
      {children}
      {required && <span className="text-[#1A73E8] ml-0.5 font-bold">*</span>}
    </label>
  );
}

// ─────────────────────────────────────────────
// Experience Date Picker Component
// ─────────────────────────────────────────────

function ExperienceDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();
  const YEARS = Array.from({ length: 25 }, (_, idx) => (currentYear - idx).toString());

  // Parse current value
  const parsePeriod = (periodStr: string) => {
    const defaultVal = {
      startMonth: "Jan",
      startYear: currentYear.toString(),
      endMonth: "Dec",
      endYear: currentYear.toString(),
      isPresent: true,
    };

    if (!periodStr) return defaultVal;

    const parts = periodStr.split(/[–-]/).map((s) => s.trim());
    if (parts.length === 0) return defaultVal;

    const parsePart = (part: string) => {
      if (!part) return { month: "Jan", year: currentYear.toString(), isPresent: false };
      if (part.toLowerCase().includes("present")) {
        return { month: "Present", year: "", isPresent: true };
      }
      const words = part.split(/\s+/).filter(Boolean);
      
      let m = "Jan";
      if (words.length > 0) {
        const wordLower = words[0].toLowerCase();
        const found = MONTHS.find(mon => mon.toLowerCase().startsWith(wordLower.slice(0, 3)));
        if (found) m = found;
        else m = words[0];
      }

      if (words.length >= 2) {
        return { month: m, year: words[1], isPresent: false };
      } else if (words.length === 1) {
        const y = parseInt(words[0]);
        if (!isNaN(y) && y > 1900 && y < 2100) {
          return { month: "Jan", year: words[0], isPresent: false };
        } else {
          return { month: m, year: currentYear.toString(), isPresent: false };
        }
      }
      return { month: "Jan", year: currentYear.toString(), isPresent: false };
    };

    const start = parsePart(parts[0]);
    const end = parts.length > 1 ? parsePart(parts[1]) : { month: "Present", year: "", isPresent: true };

    return {
      startMonth: start.month,
      startYear: start.year,
      endMonth: end.isPresent ? "Present" : end.month,
      endYear: end.isPresent ? currentYear.toString() : end.year,
      isPresent: end.isPresent || periodStr.toLowerCase().includes("present"),
    };
  };

  const { startMonth, startYear, endMonth, endYear, isPresent } = parsePeriod(value);

  const update = (updates: {
    startMonth?: string;
    startYear?: string;
    endMonth?: string;
    endYear?: string;
    isPresent?: boolean;
  }) => {
    const sM = updates.startMonth !== undefined ? updates.startMonth : startMonth;
    const sY = updates.startYear !== undefined ? updates.startYear : startYear;
    const pres = updates.isPresent !== undefined ? updates.isPresent : isPresent;
    const eM = updates.endMonth !== undefined ? updates.endMonth : endMonth;
    const eY = updates.endYear !== undefined ? updates.endYear : endYear;

    if (pres) {
      onChange(`${sM} ${sY} – Present`);
    } else {
      onChange(`${sM} ${sY} – ${eM} ${eY}`);
    }
  };

  return (
    <div className="space-y-2 bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] rounded-xl p-2.5">
      {/* Start Date Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 w-10 shrink-0">Start</span>
        <div className="grid grid-cols-2 gap-1.5 flex-1 min-w-0">
          <select
            value={startMonth}
            onChange={(e) => update({ startMonth: e.target.value })}
            className="w-full bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] rounded-lg px-2 py-1.5 text-[11px] text-[var(--sclade-text-primary)] outline-none focus:border-blue-500/40 transition-all font-semibold cursor-pointer text-center"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m} className="bg-[var(--sclade-popover-bg)] text-[var(--sclade-text-primary)]">{m}</option>
            ))}
          </select>
          <select
            value={startYear}
            onChange={(e) => update({ startYear: e.target.value })}
            className="w-full bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] rounded-lg px-2 py-1.5 text-[11px] text-[var(--sclade-text-primary)] outline-none focus:border-blue-500/40 transition-all font-semibold cursor-pointer text-center"
          >
            {YEARS.map((y) => (
              <option key={y} value={y} className="bg-[var(--sclade-popover-bg)] text-[var(--sclade-text-primary)]">{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Currently Work Here Checkbox */}
      <div className="flex items-center gap-2 pl-12 py-0.5">
        <input
          type="checkbox"
          id={`present-checkbox-${value}`}
          checked={isPresent}
          onChange={(e) => update({ isPresent: e.target.checked })}
          className="rounded border-[var(--sclade-input-border)] bg-[var(--sclade-input-bg)] text-blue-500 focus:ring-blue-500/30 w-3.5 h-3.5 cursor-pointer accent-blue-500"
        />
        <label
          htmlFor={`present-checkbox-${value}`}
          className="text-[10px] font-bold text-[var(--sclade-text-secondary)] select-none cursor-pointer hover:text-[var(--sclade-text-primary)] transition-colors"
        >
          Currently work here (Present)
        </label>
      </div>

      {/* End Date Row */}
      {!isPresent && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 w-10 shrink-0">End</span>
          <div className="grid grid-cols-2 gap-1.5 flex-1 min-w-0">
            <select
              value={endMonth === "Present" ? "Dec" : endMonth}
              onChange={(e) => update({ endMonth: e.target.value })}
              className="w-full bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] rounded-lg px-2 py-1.5 text-[11px] text-[var(--sclade-text-primary)] outline-none focus:border-blue-500/40 transition-all font-semibold cursor-pointer text-center"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m} className="bg-[var(--sclade-popover-bg)] text-[var(--sclade-text-primary)]">{m}</option>
              ))}
            </select>
            <select
              value={endYear}
              onChange={(e) => update({ endYear: e.target.value })}
              className="w-full bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] rounded-lg px-2 py-1.5 text-[11px] text-[var(--sclade-text-primary)] outline-none focus:border-blue-500/40 transition-all font-semibold cursor-pointer text-center"
            >
              {YEARS.map((y) => (
                <option key={y} value={y} className="bg-[var(--sclade-popover-bg)] text-[var(--sclade-text-primary)]">{y}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ATS Score Panel
// ─────────────────────────────────────────────

function ATSPanel({ data, onClose }: { data: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] p-8 rounded-2xl w-full max-w-xl relative shadow-xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[var(--sclade-text-muted)] hover:text-[var(--sclade-text-primary)] transition-colors p-2 hover:bg-[var(--sclade-subtle-bg)] rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative">
          <div className="flex flex-col items-center mb-8">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--sclade-primary)] mb-4 bg-[var(--sclade-selected-bg)] px-3 py-1 rounded-full border border-[var(--sclade-selected-border)]">
              Intelligence Audit
            </div>
            <div
              className={`text-7xl font-extrabold tracking-tight font-outfit ${
                data.score >= 70 ? "text-[var(--sclade-success-text,#32704F)]" : data.score >= 50 ? "text-amber-600" : "text-rose-600"
              }`}
            >
              {data.score}
            </div>
            <div className="h-2 w-64 bg-[var(--sclade-border)] rounded-full overflow-hidden mt-6">
              <div
                className={`h-full transition-all duration-700 ease-out rounded-full ${
                  data.score >= 70 ? "bg-[var(--sclade-success-text,#32704F)]" : data.score >= 50 ? "bg-amber-500" : "bg-rose-500"
                }`}
                style={{ width: `${data.score}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {Object.entries(data.breakdown || {})
              .filter(([k]) => k !== "overall")
              .map(([key, val]) => (
                <div
                  key={key}
                  className="bg-[var(--sclade-subtle-bg)] p-4 rounded-xl border border-[var(--sclade-border)] flex flex-col items-center"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--sclade-text-secondary)] mb-1">
                    {key}
                  </div>
                  <div className="text-xl font-bold text-[var(--sclade-text-primary)] font-outfit">{val as number}%</div>
                </div>
              ))}
          </div>

          {data.topIssues?.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--sclade-text-secondary)] mb-2 ml-0.5">
                Critical Improvements
              </p>
              {data.topIssues.map((issue: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 text-xs text-[var(--sclade-text-primary)] bg-[var(--sclade-subtle-bg)] border border-[var(--sclade-border)] rounded-xl px-4 py-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--sclade-primary)] shrink-0" />
                  {issue}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CV Preview (Right Panel)
// ─────────────────────────────────────────────


// ─────────────────────────────────────────────
// Main EditorClient
// ─────────────────────────────────────────────

function parseSkillEvidence(str: string) {
  const match = str.match(/^([^(]+)\((.+)\)$/);
  if (match) {
    return {
      title: match[1].trim(),
      detail: match[2].trim()
    };
  }
  return { title: str, detail: "" };
}

function ensureArray<T>(val: any): T[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

import { SmartUpdateCenter } from "@/components/dashboard/SmartUpdateCenter";

async function fetchWithRetry(url: string, options?: RequestInit, retries = 2, delay = 1000): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      if ([429, 502, 503, 504].includes(res.status) && retries > 0) {
        console.warn(`Fetch failed with status ${res.status}. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
    }
    return res;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Fetch error: ${error}. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

export function EditorClient({
  resumeId,
  versionId,
  initialData,
  signals,
  accessToken,
  initialSuggestions = [],
  initialJobTarget = null,
  initialVersionsList = [],
  initialTab = "profile",
  user,
}: {
  resumeId: string;
  versionId: string;
  initialData: any; 
  signals: any;
  accessToken?: string;
  initialSuggestions?: any[];
  initialJobTarget?: any;
  initialVersionsList?: any[];
  initialTab?: EditorTab;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  const [currentVersionId, setCurrentVersionId] = useState<string>(versionId);
  const [activeJobTarget, setActiveJobTarget] = useState<any>(initialJobTarget);
  const [versionsList, setVersionsList] = useState<any[]>(initialVersionsList);
  const [showVersionsSidebar, setShowVersionsSidebar] = useState(true);
  const [mode, setMode] = useState<"non-specialized" | "specialized">("non-specialized");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [tailorJobTitle, setTailorJobTitle] = useState("");
  const [tailorJdText, setTailorJdText] = useState("");
  const [tailorBaseOption, setTailorBaseOption] = useState<"clone" | "scratch">("clone");
  const [isCreatingTailoredVersion, setIsCreatingTailoredVersion] = useState(false);

  // Layout states for redesign
  const [zoom, setZoom] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(2);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [personalInfoOpen, setPersonalInfoOpen] = useState<boolean>(true);
  const [summaryOpen, setSummaryOpen] = useState<boolean>(true);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(new Date());
  const [mobileTab, setMobileTab] = useState<"editor" | "preview" | "versions">("editor");
  // Map ResumeVersion fields to local state
  const [personalInfo, setPersonalInfo] = useState<any>(
    typeof initialData.personalInfo === 'string' 
      ? JSON.parse(initialData.personalInfo) 
      : (initialData.personalInfo || {})
  );
  const [summary, setSummary] = useState<string>(initialData.summary || "");
  
  const [skills, setSkills] = useState<CVSkills>(() => {
    const s = initialData.skills;
    if (typeof s === 'string') {
      try { return JSON.parse(s); } catch { }
    }
    return s || { languages: [], frameworks: [], tools: [] };
  });

  const [experience, setExperience] = useState<CVExperience[]>(() => ensureArray(initialData.experience));
  const [projects, setProjects] = useState<ProjectData[]>(() => ensureArray(initialData.projects));
  const [education, setEducation] = useState<CVEducation[]>(() => ensureArray(initialData.education));
  const [achievements, setAchievements] = useState<string[]>(() => ensureArray(initialData.achievements || [""]));  
  const [achFetching, setAchFetching] = useState<Record<number, boolean>>({});
  const [achNote, setAchNote] = useState<Record<number, string>>({});
  const [draggedProjectIdx, setDraggedProjectIdx] = useState<number | null>(null);
  const [dragOverProjectIdx, setDragOverProjectIdx] = useState<number | null>(null);
  const [draggedExpIdx, setDraggedExpIdx] = useState<number | null>(null);
  const [dragOverExpIdx, setDragOverExpIdx] = useState<number | null>(null);
  
  // LIVE PROJECTS SYNC: Remove redundant fetch on mount as initialData is already version-specific
  // and fetching from /api/projects would corrupt specialized versions with 'Main' data.


  const [activeTab, setActiveTab] = useState<EditorTab>(initialTab);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [atsData, setAtsData] = useState<any>(null);
  const [atsError, setAtsError] = useState<string | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [atsPanelOpen, setAtsPanelOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "error" | "info" | "warning" } | null>(null);

  const showToast = useCallback((message: string, type: "error" | "info" | "warning" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);
  const [isTailoring, setIsTailoring] = useState(false);
  const [jdText, setJdText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [theme, setTheme] = useState("light");
  const [leftWidth, setLeftWidth] = useState(440);
  const [rightWidth, setRightWidth] = useState(360);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const isNarrowLeft = leftWidth < 430 || windowWidth < 768;

  const resizingLeftRef = useRef(false);
  const resizingRightRef = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (resizingLeftRef.current) {
      const newWidth = Math.max(300, Math.min(650, e.clientX));
      setLeftWidth(newWidth);
    } else if (resizingRightRef.current) {
      const newWidth = Math.max(260, Math.min(550, window.innerWidth - e.clientX));
      setRightWidth(newWidth);
    }
  }, []);

  const stopAllResizing = useCallback(() => {
    resizingLeftRef.current = false;
    resizingRightRef.current = false;
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopAllResizing);
  }, [handleMouseMove]);

  const startLeftResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizingLeftRef.current = true;
    setIsDraggingLeft(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopAllResizing);
  }, [handleMouseMove, stopAllResizing]);

  const startRightResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizingRightRef.current = true;
    setIsDraggingRight(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopAllResizing);
  }, [handleMouseMove, stopAllResizing]);

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopAllResizing);
    };
  }, [handleMouseMove, stopAllResizing]);

  // Center preview responsive auto-fit container observer
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [zoomOption, setZoomOption] = useState<string>("fit");

  useEffect(() => {
    if (!previewContainerRef.current) return;
    const el = previewContainerRef.current;
    const updateWidth = () => {
      if (el) {
        setContainerWidth(el.clientWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(() => updateWidth());
    ro.observe(el);
    return () => ro.disconnect();
  }, [isLeftCollapsed, isRightCollapsed, leftWidth, rightWidth]);

  const previewScale = useMemo(() => {
    if (zoomOption === "fit") {
      if (!containerWidth) return 0.85;
      const available = Math.max(280, containerWidth - 48);
      return Math.min(1.15, Math.max(0.35, available / 794));
    }
    return Number(zoomOption) / 100;
  }, [zoomOption, containerWidth]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("sclade-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setShowVersionsSidebar(false);
      }
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("sclade-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("sclade-theme", "dark");
    }
  }, [theme]);

  const isMobile = windowWidth < 768;
  const effectiveSidebarWidth = isMobile ? windowWidth : leftWidth;
  const isCompact = effectiveSidebarWidth < 460;
  const isCurrentVersionMain = versionsList.find(v => v.id === currentVersionId)?.isMain ?? initialData.isMain;

  // Derived CV object for preview and PDF
  const cv: CVData = {
    name: personalInfo.name || "",
    email: personalInfo.email || "",
    phone: personalInfo.phone || "",
    location: personalInfo.location || "",
    github: personalInfo.github || "",
    linkedin: personalInfo.linkedin || "",
    summary,
    targetRole: personalInfo.targetRole || "Software Engineer",
    skills,
    experience,
    education,
    achievements,
    atsScore: initialData.atsScore,
  };

  // AI action states
  const [regeneratingSummary, setRegeneratingSummary] = useState(false);
  const [suggestingSkills, setSuggestingSkills] = useState(false);
  const [rewritingBullet, setRewritingBullet] = useState<string | null>(null); // "projIdx-bulletIdx"
  const [suggestedSummary, setSuggestedSummary] = useState<string | null>(null);
  const [suggestedProjectBullets, setSuggestedProjectBullets] = useState<Record<string, string>>({});

  // Expanded card tracking
  const [expandedProject, setExpandedProject] = useState<number | null>(0);
  const [expandedExperience, setExpandedExperience] = useState<number | null>(0);

  const [isSyncing, setIsSyncing] = useState(false);
  const [generatingExpBullets, setGeneratingExpBullets] = useState<number | null>(null);
  const [generatingProjectFromReadme, setGeneratingProjectFromReadme] = useState<number | null>(null);
  const [expContext, setExpContext] = useState<Record<number, string>>({});
  const [cvWarnings, setCvWarnings] = useState<string[]>([]); // CV quality warnings from save API
  const [skillValidation, setSkillValidation] = useState<{
    verified: string[];
    unverified: string[];
    suggested: { languages: string[]; frameworks: string[]; tools: string[] };
  } | null>(null);
  const [validatingSkills, setValidatingSkills] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirty = useRef(false);

  // ── Auto-save (debounced 2s) ──
  const saveCV = useCallback(async () => {
    if (isSyncing) return; // DON'T save if we are currently syncing from GitHub
    setSaveStatus("saving");
    try {
      // Authoritatively normalize categories and cross-deduplicate skills before saving
      const dedupeSkills = (s: any) => normalizeAndDedupeSkills(s);

      // Auto-fix duplicate words in experience titles before saving
      const cleanedExperience = experience.map(exp => ({
        ...exp,
        title: (exp.title || "").replace(/\b(\w+)\s+\1\b/gi, "$1").trim(),
      }));

      const res = await fetch("/api/cv/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          versionId: currentVersionId, 
          data: {
            personalInfo,
            summary,
            skills: dedupeSkills(skills),
            experience: cleanedExperience,
            projects,
            education,
            achievements,
            atsScore: atsData?.score || 0
          }
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      // Surface any CV quality warnings
      if (saved.warnings && saved.warnings.length > 0) {
        setCvWarnings(saved.warnings);
        setTimeout(() => setCvWarnings([]), 8000); // auto-dismiss after 8s
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
    }
  }, [currentVersionId, personalInfo, summary, skills, experience, projects, education, achievements, atsData, isSyncing]);



  useEffect(() => {
    // Skip the very first run on mount to prevent immediate save of unchanged data
    if (!isDirty.current) {
      isDirty.current = true;
      return;
    }

    if (isSyncing) return; // PAUSE auto-save during sync
    
    // Also pause during active AI generations
    if (
      regeneratingSummary ||
      suggestingSkills ||
      generatingExpBullets !== null ||
      generatingProjectFromReadme !== null ||
      rewritingBullet !== null ||
      isTailoring ||
      isCreatingTailoredVersion
    ) {
      return;
    }
    
    setSaveStatus("idle");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    
    // Set timer for 2 seconds
    saveTimer.current = setTimeout(() => {
      saveCV();
    }, 2000);

    return () => { 
      if (saveTimer.current) clearTimeout(saveTimer.current); 
    };
  }, [personalInfo, summary, skills, experience, projects, education, achievements, isSyncing, 
      regeneratingSummary, suggestingSkills, generatingExpBullets, generatingProjectFromReadme, 
      rewritingBullet, isTailoring, isCreatingTailoredVersion, saveCV]);

  // ── beforeunload guard: save immediately if dirty on tab close ──
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isDirty.current) {
        saveCV();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveCV]);

  // ── Load ATS score callback ──
  const loadATS = useCallback(async () => {
    setIsScoring(true);
    setAtsError(null);
    try {
      const r = await fetch(`/api/cv/ats-score?versionId=${currentVersionId}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      if (d.error) {
        setAtsError(d.error);
        setAtsData(null);
      } else {
        setAtsData(d);
        setAtsError(null);
      }
    } catch (e: any) {
      setAtsError(e.message || "Failed to analyze resume");
      setAtsData(null);
    } finally {
      setIsScoring(false);
    }
  }, [currentVersionId]);

  // ── Load ATS score on mount ──
  useEffect(() => {
    loadATS();
  }, [loadATS]);

  // Save immediately when switching tabs if there is a pending save
  useEffect(() => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
      saveCV();
    }
  }, [activeTab, saveCV]);

  // ── State update helpers ──
  const updatePersonalInfo = (field: string, val: any) =>
    setPersonalInfo((prev: any) => ({ ...prev, [field]: val }));

  const updateSkills = (type: keyof CVSkills, val: string[]) =>
    setSkills((prev) => ({ ...prev, [type]: val }));

  const addSkill = (type: keyof CVSkills, raw: string) => {
    const val = raw.trim();
    if (!val) return;
    const current = skills[type] || [];
    if (!current.includes(val)) updateSkills(type, [...current, val]);
  };

  const removeSkill = (type: keyof CVSkills, idx: number) => {
    const nu = [...(skills[type] || [])];
    nu.splice(idx, 1);
    updateSkills(type, nu);
  };

  const updateExp = (i: number, field: keyof CVExperience, val: any) => {
    const nu = [...experience];
    (nu[i] as any)[field] = val;
    setExperience(nu);
  };

  const updateExpBullet = (expIdx: number, bulletIdx: number, val: string) => {
    const nu = [...experience];
    nu[expIdx] = { ...nu[expIdx], bullets: [...nu[expIdx].bullets] };
    nu[expIdx].bullets[bulletIdx] = val;
    setExperience(nu);
  };


  const addExpBullet = (expIdx: number) => {
    if ((experience[expIdx]?.bullets?.length || 0) >= 3) return; // max 3 bullets per role
    const nu = [...experience];
    nu[expIdx] = { ...nu[expIdx], bullets: [...nu[expIdx].bullets, ""] };
    setExperience(nu);
  };

  const removeExpBullet = (expIdx: number, bulletIdx: number) => {
    const nu = [...experience];
    nu[expIdx] = {
      ...nu[expIdx],
      bullets: nu[expIdx].bullets.filter((_, i) => i !== bulletIdx),
    };
    setExperience(nu);
  };

  const addExperience = () => {
    if (experience.length >= 3) return; // CV hard limit: max 3 experience entries
    setExperience([
      ...experience,
      { company: "", title: "", period: "", bullets: [""] },
    ]);
  };

  const removeExperience = (i: number) => {
    setExperience(experience.filter((_, idx) => idx !== i));
  };

  // ── Education helpers ──
  const updateEdu = (i: number, field: keyof CVEducation, val: any) => {
    const nu = [...education];
    (nu[i] as any)[field] = val;
    setEducation(nu);
  };

  const addEducation = () => {
    if (education.length >= 3) return; // CV hard limit: max 3 education entries
    setEducation([...education, { school: "", degree: "", year: "", gpa: "", gpaType: "gpa", current: false }]);
  };

  const removeEducation = (i: number) => {
    setEducation(education.filter((_, idx) => idx !== i));
  };

  // ── Project helpers ──
  const updateProject = (i: number, field: keyof ProjectData, val: any) => {
    const nu = [...projects];
    (nu[i] as any)[field] = val;
    setProjects(nu);
  };

  // Fixes a highlight (bullet) at a specific index in a project
  const updateProjectBullet = (pIdx: number, bIdx: number, val: string) => {
    const nu = [...projects];
    const highlights = [...(nu[pIdx].highlights || [])];
    highlights[bIdx] = val;
    nu[pIdx] = { ...nu[pIdx], highlights };
    setProjects(nu);
  };

  const updateProjectHighlight = updateProjectBullet; // alias kept for compatibility

  const handleAcceptSuggestion = (field: string, value: any, index?: number, bulletIndex?: number) => {
    if (field === "summary") {
      setSummary(value);
      setSuggestedSummary(null);
    } else if (field === "project-bullet") {
      const nu = [...projects];
      const highlights = [...(nu[index!].highlights || [])];
      highlights[bulletIndex!] = value;
      nu[index!] = { ...nu[index!], highlights };
      setProjects(nu);
      
      const projectId = projects[index!].id;
      const bulletKey = `${projectId}-${bulletIndex}`;
      setSuggestedProjectBullets(prev => {
        const copy = { ...prev };
        delete copy[bulletKey];
        return copy;
      });
    }
  };

  const handleDiscardSuggestion = (field: string, index?: number, bulletIndex?: number) => {
    if (field === "summary") {
      setSuggestedSummary(null);
    } else if (field === "project-bullet") {
      const projectId = projects[index!].id;
      const bulletKey = `${projectId}-${bulletIndex}`;
      setSuggestedProjectBullets(prev => {
        const copy = { ...prev };
        delete copy[bulletKey];
        return copy;
      });
    }
  };

  // ── AI Experience Bullet Generation ──
  const handleGenerateExpBullets = async (i: number) => {
    const exp = experience[i];
    if (!exp.company && !exp.title) return;
    setGeneratingExpBullets(i);
    try {
      const res = await fetchWithRetry("/api/cv/generate-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: exp.company,
          title: exp.title,
          period: exp.period,
          context: expContext[i] || "",
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }
      const d = await res.json();
      if (d.bullets && Array.isArray(d.bullets)) {
        const nu = [...experience];
        const existingMeaningful = nu[i].bullets.filter(
          b => b.trim() && b !== "Achieved X by implementing Y resulting in Z% growth."
        );
        nu[i] = { ...nu[i], bullets: [...existingMeaningful, ...d.bullets] };
        setExperience(nu);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to generate experience bullets. Please try again.");
    } finally {
      setGeneratingExpBullets(null);
    }
  };

  const handleGenerateProjectFromReadme = async (idx: number) => {
    const p = projects[idx];
    if (!p.title) return;
    setGeneratingProjectFromReadme(idx);
    try {
      const res = await fetchWithRetry("/api/github/project-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: p.title,
          techStack: p.techStack || [],
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }
      const d = await res.json();
      if (d.success) {
        const nu = [...projects];
        nu[idx] = {
          ...nu[idx],
          description: d.description,
          highlights: d.highlights || [],
        };
        setProjects(nu);
      } else {
        throw new Error(d.error || "Failed to sync project from README.");
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to sync project details. Please try again.");
    } finally {
      setGeneratingProjectFromReadme(null);
    }
  };

  // ── Skill Validation (cross-ref against real repos) ──
  const handleValidateSkills = async () => {
    setValidatingSkills(true);
    setSkillValidation(null); 
    try {
      const res = await fetch("/api/cv/validate-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSkills: skills }),
      });
      const d = await res.json();
      
      if (res.ok) {
        setSkillValidation(d);
      }
    } catch {
      /* silent background failure */
    } finally {
      setValidatingSkills(false);
    }
  };

  const handleRemoveUnverified = () => {
    if (!skillValidation) return;
    const unverifiedLower = new Set(skillValidation.unverified.map(s => s.toLowerCase()));
    setSkills({
      languages: (skills.languages || []).filter(s => !unverifiedLower.has(s.toLowerCase())),
      frameworks: (skills.frameworks || []).filter(s => !unverifiedLower.has(s.toLowerCase())),
      tools: (skills.tools || []).filter(s => !unverifiedLower.has(s.toLowerCase())),
    });
    setSkillValidation(null); // clear results after fix
  };

  // ── AI actions ──
  const handleRegenerateSummary = async () => {
    setRegeneratingSummary(true);
    try {
      const res = await fetchWithRetry("/api/cv/regenerate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projects,
          skills,
          experience,
          targetRole: personalInfo.targetRole,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const message = errData.message || (res.status === 429 ? "Daily AI limit reached" : (res.status === 503 ? "AI is busy, try again in a minute" : "Failed to improve summary."));
        showToast(message, "error");
        return; // Leave current text unchanged
      }
      const d = await res.json();
      if (d.summary) {
        setSuggestedSummary(d.summary);
      } else {
        showToast("No summary returned from the AI service.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to improve summary. Please try again.", "error");
    } finally {
      setRegeneratingSummary(false);
    }
  };

  const handleSuggestSkills = async () => {
    setSuggestingSkills(true);
    try {
      const res = await fetchWithRetry("/api/cv/suggest-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projects,
          existing: [
            ...(skills.languages || []),
            ...(skills.frameworks || []),
            ...(skills.tools || []),
          ],
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }
      const d = await res.json();
      if (d.skills) {
        const s = d.skills;
        // Deduplicate case-insensitively when merging
        const mergeUnique = (existing: string[], incoming: string[]) => {
          const seen = new Set(existing.map(x => x.toLowerCase()));
          const result = [...existing];
          for (const item of incoming) {
            if (item && !seen.has(item.toLowerCase())) {
              result.push(item);
              seen.add(item.toLowerCase());
            }
          }
          return result;
        };
        setSkills({
          languages: mergeUnique(skills.languages || [], s.languages || []),
          frameworks: mergeUnique(skills.frameworks || [], s.frameworks || []),
          tools: mergeUnique(skills.tools || [], s.tools || []),
        });
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to suggest skills. Please try again.");
    } finally {
      setSuggestingSkills(false);
    }
  };

  const handleRewriteBullet = async (
    pIdx: number,
    bIdx: number,
    current: string
  ) => {
    const key = `${pIdx}-${bIdx}`;
    setRewritingBullet(key);
    try {
      const p = projects[pIdx];
      const res = await fetchWithRetry("/api/cv/regenerate-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet: current,
          projectName: p.title, // was p.name — ProjectData has `title`, not `name`
          tech: p.techStack,
          targetRole: cv.targetRole,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const message = errData.message || (res.status === 429 ? "Daily AI limit reached" : (res.status === 503 ? "AI is busy, try again in a minute" : "Failed to optimize bullet."));
        showToast(message, "error");
        return; // Leave current text unchanged
      }
      const d = await res.json();
      if (d.bullet) {
        const projectId = projects[pIdx].id;
        setSuggestedProjectBullets(prev => ({ ...prev, [`${projectId}-${bIdx}`]: d.bullet }));
      } else {
        showToast("No rewritten bullet returned from the AI service.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to optimize bullet. Please try again.", "error");
    } finally {
      setRewritingBullet(null);
    }
  };

  const handleExportPDF = async () => {
    const included = projects.filter((p) => p.included !== false);
    const projectsWithEmptyHighlights = included.filter(
      (p) => !p.highlights || p.highlights.filter((h) => h && h.trim().length > 0).length === 0
    );
    if (projectsWithEmptyHighlights.length > 0) {
      const names = projectsWithEmptyHighlights.map((p) => p.title || "Untitled Project").join(", ");
      alert(`Warning: The following projects have no bullet highlights and will be skipped in the exported PDF: ${names}`);
    }

    setIsExporting(true);
    try {
      const res = await fetch("/api/cv/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, projects: projects.filter((p) => p.included !== false) }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${(cv.name || "resume").replace(/\s+/g, "_")}_resume.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        showToast("Export failed. Please try again.", "error");
      }
    } catch {
      showToast("Export failed. Please try again.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleTailorResume = async () => {
    if (!jdText) return;
    setIsTailoring(true);
    try {
      const res = await fetchWithRetry("/api/cv/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resumeId, 
          jobDescription: jdText,
          jobTitle,
          versionId: currentVersionId
        }),
      });
      const result = await res.json();
      if (result.success) {
        const d = result.data;
        setCurrentVersionId(result.versionId);
        setActiveJobTarget(result.jobTarget);
        setPersonalInfo(d.personalInfo);
        setSummary(d.summary);
        setSkills(d.skills);
        setExperience(d.experience);
        setProjects(d.projects);
        setEducation(d.education);
        
        const newVerItem = {
          id: result.versionId,
          versionName: d.versionName,
          isMain: d.isMain,
          createdAt: d.createdAt,
          atsScore: d.atsScore,
          jobTarget: result.jobTarget
        };
        setVersionsList(prev => {
          const exists = prev.some(v => v.id === result.versionId);
          if (exists) {
            return prev.map(v => v.id === result.versionId ? newVerItem : v);
          }
          return [newVerItem, ...prev];
        });

        // Update URL query parameters dynamically without full reload
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.set("versionId", result.versionId);
          window.history.pushState({}, "", url.toString());
        }

        alert("Resume successfully tailored for " + (jobTitle || "the position") + "!");
      } else {
        throw new Error(result.error || "Failed to tailor resume.");
      }
    } catch (error: any) {
      console.error("Tailoring failed", error);
      alert(error.message || "An error occurred during resume tailoring.");
    } finally {
      setIsTailoring(false);
    }
  };

  const handleReanalyze = async () => {
    if (!activeJobTarget || !activeJobTarget.description) return;
    setIsTailoring(true);
    try {
      const res = await fetchWithRetry("/api/cv/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resumeId, 
          jobDescription: activeJobTarget.description,
          jobTitle: activeJobTarget.title || "",
          versionId: currentVersionId
        }),
      });
      const result = await res.json();
      if (result.success) {
        const d = result.data;
        setCurrentVersionId(result.versionId);
        setActiveJobTarget(result.jobTarget);
        setPersonalInfo(d.personalInfo);
        setSummary(d.summary);
        setSkills(d.skills);
        setExperience(d.experience);
        setProjects(d.projects);
        setEducation(d.education);
        
        const newVerItem = {
          id: result.versionId,
          versionName: d.versionName,
          isMain: d.isMain,
          createdAt: d.createdAt,
          atsScore: d.atsScore,
          jobTarget: result.jobTarget
        };
        setVersionsList(prev => {
          return prev.map(v => v.id === result.versionId ? newVerItem : v);
        });

        alert("Resume successfully re-analyzed and matched!");
      } else {
        alert("Failed to re-analyze: " + (result.error || "Unknown error"));
      }
    } catch (error: any) {
      console.error("Re-analysis failed", error);
      alert("Error re-analyzing resume: " + (error.message || "Unknown error"));
    } finally {
      setIsTailoring(false);
    }
  };

  const handleCreateNewVersion = async () => {
    try {
      const res = await fetch("/api/cv/create-version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, sourceVersionId: currentVersionId })
      });
      const result = await res.json();
      if (result.success) {
        window.location.href = `/editor?versionId=${result.versionId}&tab=${activeTab}`;
      } else {
        alert("Failed to initiate a new tailored version: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Initiating version failed", error);
      alert("An error occurred while creating a new version.");
    }
  };

  const handleTailorNewJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingTailoredVersion(true);

    try {
      // 1. Create a new version
      const createRes = await fetchWithRetry("/api/cv/create-version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resumeId, 
          sourceVersionId: currentVersionId,
          startFromScratch: tailorBaseOption === "scratch"
        })
      });
      const createResult = await createRes.json();
      if (!createResult.success) {
        alert("Failed to create version: " + (createResult.error || "Unknown error"));
        setIsCreatingTailoredVersion(false);
        return;
      }

      const newVersionId = createResult.versionId;

      // 2. If JD is provided, run tailoring
      if (tailorJdText.trim()) {
        const tailorRes = await fetchWithRetry("/api/cv/tailor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeId,
            versionId: newVersionId,
            jobTitle: tailorJobTitle,
            jobDescription: tailorJdText
          })
        });
        const tailorResult = await tailorRes.json();
        if (tailorResult.success) {
          const d = tailorResult.data;
          setCurrentVersionId(newVersionId);
          setActiveJobTarget(tailorResult.jobTarget);
          setPersonalInfo(d.personalInfo);
          setSummary(d.summary);
          setSkills(d.skills);
          setExperience(d.experience);
          setProjects(d.projects);
          setEducation(d.education);
          
          const newVerItem = {
            id: newVersionId,
            versionName: d.versionName,
            isMain: d.isMain,
            createdAt: d.createdAt,
            atsScore: d.atsScore,
            jobTarget: tailorResult.jobTarget
          };
          setVersionsList(prev => [newVerItem, ...prev]);

          // Update URL query parameters and switch tab
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("versionId", newVersionId);
            url.searchParams.set("tab", "tailor");
            window.history.pushState({}, "", url.toString());
          }
          setActiveTab("tailor");
          alert("Resume successfully created and tailored!");
        } else {
          alert("Created version, but tailoring failed: " + (tailorResult.error || "AI error"));
          window.location.href = `/editor?versionId=${newVersionId}&tab=tailor`;
        }
      } else {
        // No JD: go straight to profile editing
        window.location.href = `/editor?versionId=${newVersionId}&tab=profile`;
      }
      setShowTailorModal(false);
    } catch (error) {
      console.error("Tailor new job failed", error);
      alert("An error occurred during version creation.");
    } finally {
      setIsCreatingTailoredVersion(false);
    }
  };

  const handleResetToMain = () => {
    setCurrentVersionId(versionId);
    setActiveJobTarget(null);
    setPersonalInfo(typeof initialData.personalInfo === 'string' ? JSON.parse(initialData.personalInfo) : (initialData.personalInfo || {}));
    setSummary(initialData.summary || "");
    setSkills(typeof initialData.skills === 'string' ? JSON.parse(initialData.skills) : (initialData.skills || { languages: [], frameworks: [], tools: [] }));
    setExperience(ensureArray(initialData.experience));
    setProjects(ensureArray(initialData.projects));
    setEducation(ensureArray(initialData.education));
    setAchievements(ensureArray(initialData.achievements || [""]));
    setJdText("");
    setJobTitle("");
  };

  // ── Save status UI / Global Save Button ──
  const SaveIndicator = () => {
    const hasUnsavedChanges = !!saveTimer.current;
    
    let btnText = isCompact ? "Saved" : "Saved ✓";
    let btnStyle = "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 cursor-default";
    let Icon = CheckCircle2;
    
    if (saveStatus === "saving") {
      btnText = isCompact ? "Saving" : "Saving...";
      btnStyle = "text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 cursor-not-allowed";
      Icon = Loader2;
    } else if (saveStatus === "error") {
      btnText = isCompact ? "Error" : "Sync Error";
      btnStyle = "text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 cursor-pointer animate-pulse";
      Icon = AlertTriangle;
    } else if (hasUnsavedChanges) {
      btnText = isCompact ? "Save" : "Save changes";
      btnStyle = "text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.15)]";
      Icon = Save;
    } else if (saveStatus === "idle") {
      btnText = isCompact ? "Save" : "Save Resume";
      btnStyle = "text-neutral-600 dark:text-neutral-400 bg-neutral-500/10 border border-neutral-500/20 hover:bg-neutral-500/20 cursor-pointer";
      Icon = Save;
    }
    
    const handleManualSave = () => {
      if (saveStatus === "saving") return;
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
      saveCV();
    };

    return (
      <button
        onClick={handleManualSave}
        disabled={saveStatus === "saving"}
        className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] ${isCompact ? "px-2 py-1.5" : "px-3 py-1.5"} rounded-xl transition-all active:scale-95 ${btnStyle}`}
      >
        {Icon === Loader2 ? <Icon className="w-3 h-3 animate-spin" /> : <Icon className="w-3 h-3" />}
        {btnText}
      </button>
    );
  };

  // ── CV quality warnings banner ──
  const CvWarningBanner = () => {
    if (cvWarnings.length === 0) return null;
    return (
      <div className="mx-4 mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">CV Quality Issues Detected</p>
          {cvWarnings.map((w, i) => (
            <p key={i} className="text-[10px] text-amber-800/80 dark:text-amber-300/70">{w}</p>
          ))}
        </div>
        <button onClick={() => setCvWarnings([])} className="ml-auto text-amber-600/50 hover:text-amber-700 dark:text-amber-500/50 dark:hover:text-amber-400">
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  };

  // ─────────────────────────────────────────────
  // Tab: Profile
  // ─────────────────────────────────────────────
  const renderProfile = () => (
    <div className="space-y-4">
      {/* Accordion 1: Personal Information */}
      <div className="bg-white dark:bg-neutral-900 border border-[#DADCE0] dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setPersonalInfoOpen((prev) => !prev)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-900 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-[#1A73E8]" />
            <span className="text-[13px] font-bold text-[#202124] dark:text-neutral-100 font-outfit">
              Personal Information
            </span>
          </div>
          {personalInfoOpen ? (
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </button>

        {personalInfoOpen && (
          <div className="p-4 pt-1 space-y-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className={`grid ${isNarrowLeft ? "grid-cols-1" : "grid-cols-2"} gap-3.5`}>
              <div className="col-span-1">
                <SectionLabel required>Full Name</SectionLabel>
                <InlineEdit
                  value={cv.name}
                  onChange={(v) => updatePersonalInfo("name", v)}
                  placeholder="e.g. Adel Muhammed"
                />
              </div>
              <div className="col-span-1">
                <SectionLabel required>Target Job Title</SectionLabel>
                <InlineEdit
                  value={cv.targetRole}
                  onChange={(v) => updatePersonalInfo("targetRole", v)}
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div className="col-span-1">
                <SectionLabel required>Email Address</SectionLabel>
                <InlineEdit
                  value={cv.email}
                  onChange={(v) => updatePersonalInfo("email", v)}
                  placeholder="professional@email.com"
                />
              </div>
              <div className="col-span-1">
                <SectionLabel required>Phone Number</SectionLabel>
                <InlineEdit
                  value={cv.phone}
                  onChange={(v) => updatePersonalInfo("phone", v)}
                  placeholder="+1 (555) 000 000"
                />
              </div>
              <div className={isNarrowLeft ? "col-span-1" : "col-span-2"}>
                <SectionLabel required>Location</SectionLabel>
                <InlineEdit
                  value={cv.location}
                  onChange={(v) => updatePersonalInfo("location", v)}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
              <div className="col-span-1">
                <SectionLabel>GitHub Link</SectionLabel>
                <InlineEdit
                  value={cv.github}
                  onChange={(v) => updatePersonalInfo("github", v)}
                  placeholder="github.com/handle"
                  icon={
                    <svg className="w-4 h-4 fill-current text-neutral-800 dark:text-neutral-200" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  }
                />
              </div>
              <div className="col-span-1">
                <SectionLabel>LinkedIn Link</SectionLabel>
                <InlineEdit
                  value={cv.linkedin}
                  onChange={(v) => updatePersonalInfo("linkedin", v)}
                  placeholder="linkedin.com/in/handle"
                  icon={
                    <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Professional Summary */}
      <div className="bg-white dark:bg-neutral-900 border border-[#DADCE0] dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setSummaryOpen((prev) => !prev)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-900 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-[#1A73E8]" />
            <span className="text-[13px] font-bold text-[#202124] dark:text-neutral-100 font-outfit">
              Professional Summary
            </span>
          </div>
          {summaryOpen ? (
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </button>

        {summaryOpen && (
          <div className="p-4 pt-1 space-y-3 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <SectionLabel>Summary</SectionLabel>
              <button
                type="button"
                onClick={handleRegenerateSummary}
                disabled={regeneratingSummary}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1A73E8] hover:text-[#1557B0] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {regeneratingSummary ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>AI Improve</span>
              </button>
            </div>
            <InlineEdit
              value={cv.summary}
              onChange={(v) => setSummary(v)}
              placeholder="Software Engineer specializing in scalable web services..."
              multiline
              rows={5}
            />
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
              <span className="text-[10px] text-neutral-500">
                Aim for 2-3 concise, high-impact technical sentences.
              </span>
              <span className="font-mono text-neutral-500 font-medium">
                {summary.length}/500
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <SectionLabel>Education</SectionLabel>
        {education.length < 3 ? (
          <button
            onClick={addEducation}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--sclade-text-secondary)] hover:text-[var(--sclade-text-primary)] transition-all bg-[var(--sclade-btn-secondary-bg)] px-3 py-1.5 rounded-full border border-[var(--sclade-popover-border)]"
          >
            <Plus className="w-3.5 h-3.5" /> Entry
          </button>
        ) : (
          <span className="text-[9px] font-black uppercase tracking-widest text-amber-600/70 px-3 py-1.5 rounded-full border border-amber-600/20 bg-amber-600/5">
            Max 3 reached
          </span>
        )}
      </div>
      {education.map((edu, i) => (
        <div key={i} className="group relative bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] rounded-2xl p-5 mb-4 hover:border-blue-500/20 transition-all">
          <button
            onClick={() => removeEducation(i)}
            className="absolute top-4 right-4 text-neutral-700 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-500/5"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className={`grid ${isNarrowLeft ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
            <div className={isNarrowLeft ? "col-span-1" : "col-span-2"}>
              <SectionLabel>Institution</SectionLabel>
              <InlineEdit value={edu.school} onChange={(v) => updateEdu(i, "school", v)} placeholder="University Name" />
            </div>
            <div className={isNarrowLeft ? "col-span-1" : "col-span-2"}>
              <SectionLabel>Degree / Certification</SectionLabel>
              <InlineEdit value={edu.degree} onChange={(v) => updateEdu(i, "degree", v)} placeholder="B.Sc. in Engineering" />
            </div>
            <div className="col-span-1">
               <div className="flex items-center justify-between mb-1.5">
                 <SectionLabel>Completion</SectionLabel>
                 <button
                   type="button"
                   onClick={() => updateEdu(i, "current" as any, !edu.current)}
                   className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider transition-all select-none cursor-pointer ${
                     edu.current
                       ? "bg-emerald-600 text-white shadow-[0_2px_8px_rgba(16,185,129,0.2)] font-bold"
                       : "bg-[var(--sclade-btn-secondary-bg)] text-[var(--sclade-text-secondary)] border border-[var(--sclade-popover-border)] hover:text-[var(--sclade-text-primary)]"
                   }`}
                 >
                   Pursuing
                 </button>
               </div>
               <InlineEdit 
                 value={edu.year} 
                 onChange={(v) => updateEdu(i, "year", v)} 
                 placeholder={edu.current ? "Expected 2027" : "2024"} 
               />
            </div>
            <div className="col-span-1">
               <SectionLabel>GPA / Mark Type</SectionLabel>
               <div className="flex bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] p-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider gap-0.5 select-none w-full mb-1.5 shrink-0">
                 {(["gpa", "cgpa", "percentage"] as const).map((t) => (
                   <button
                     key={t}
                     type="button"
                     onClick={() => updateEdu(i, "gpaType" as any, t)}
                     className={`flex-1 py-1 rounded transition-all cursor-pointer text-center ${
                       (edu.gpaType || "gpa") === t
                         ? "bg-blue-600 text-white font-bold"
                         : "text-[var(--sclade-text-muted)] hover:text-[var(--sclade-text-secondary)]"
                     }`}
                   >
                     {t === "percentage" ? "%" : t.toUpperCase()}
                   </button>
                 ))}
               </div>
               <InlineEdit 
                 value={edu.gpa || ""} 
                 onChange={(v) => updateEdu(i, "gpa", v)} 
                 placeholder={(edu.gpaType || "gpa") === "percentage" ? "75" : (edu.gpaType || "gpa") === "cgpa" ? "9.2" : "4.0"} 
               />
            </div>
          </div>
        </div>
      ))}

      {/* Achievements & Certifications */}
      <div className="pt-8 border-t border-white/5">
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Achievements & Certifications</SectionLabel>
          {achievements.length < 4 ? (
            <button
              onClick={() => setAchievements([...achievements, ""])}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5"
            >
              <Plus className="w-3.5 h-3.5" /> Achievement
            </button>
          ) : (
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-600/70 px-3 py-1.5 rounded-full border border-amber-600/20 bg-amber-600/5">
              Max 4 reached
            </span>
          )}
        </div>
        <div className="space-y-4">
          {achievements.map((ach, idx) => {
            const parsed = parseAchievementString(ach);
            
            const updatePart = (field: "title" | "date" | "url", val: string) => {
              const nu = [...achievements];
              const updatedObj = {
                title: field === "title" ? val : parsed.title,
                date: field === "date" ? val : parsed.date,
                url: field === "url" ? val : parsed.url || "",
              };
              nu[idx] = JSON.stringify(updatedObj);
              setAchievements(nu);
            };

            const autoFill = async () => {
              const url = parsed.url?.trim();
              if (!url) return;
              setAchFetching((prev) => ({ ...prev, [idx]: true }));
              setAchNote((prev) => ({ ...prev, [idx]: "" }));
              try {
                const res = await fetch("/api/cv/fetch-credential", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ url }),
                });
                const data = await res.json();

                if (data.cannotRead) {
                  // Can't scrape — tell user, but still apply issuer if we got one
                  setAchNote((prev) => ({
                    ...prev,
                    [idx]: data.note ?? "Could not read this link. Please fill title and date manually.",
                  }));
                  if (data.issuer && !parsed.title) {
                    // At least pre-fill issuer into title as a hint
                    const nu = [...achievements];
                    nu[idx] = JSON.stringify({ title: data.issuer + " Certificate", date: parsed.date, url: parsed.url });
                    setAchievements(nu);
                  }
                  return;
                }

                if (res.ok && (data.title || data.date || data.issuer)) {
                  const nu = [...achievements];
                  const current = parseAchievementString(nu[idx]);
                  // Build title: "Cert Name – Issuer" only if both exist
                  let newTitle = current.title;
                  if (data.title) {
                    newTitle = data.issuer && !data.title.toLowerCase().includes(data.issuer.toLowerCase())
                      ? `${data.title} – ${data.issuer}`
                      : data.title;
                  } else if (data.issuer && !current.title) {
                    newTitle = data.issuer + " Certificate";
                  }
                  nu[idx] = JSON.stringify({
                    title: newTitle,
                    date: data.date || current.date,
                    url: current.url || "",
                  });
                  setAchievements(nu);
                  setAchNote((prev) => ({
                    ...prev,
                    [idx]: data.date ? "✓ Auto-filled from link" : "✓ Title auto-filled. Enter date manually.",
                  }));
                } else {
                  setAchNote((prev) => ({
                    ...prev,
                    [idx]: "Couldn't read metadata from this link — please fill manually.",
                  }));
                }
              } catch (e) {
                console.error("[auto-fill]", e);
                setAchNote((prev) => ({ ...prev, [idx]: "Network error — please fill manually." }));
              } finally {
                setAchFetching((prev) => ({ ...prev, [idx]: false }));
              }
            };

            return (
              <div key={idx} className="relative group p-4 bg-[var(--sclade-input-bg)] rounded-xl border border-[var(--sclade-input-border)] hover:border-[var(--sclade-popover-border)] transition-all flex flex-col gap-4">
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAchievements(achievements.filter((_, i) => i !== idx))}
                    className="text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3">
                    <SectionLabel>Achievement / Certificate Title</SectionLabel>
                    <InlineEdit
                      value={parsed.title}
                      onChange={(v) => updatePart("title", v)}
                      placeholder="e.g. AWS Certified Solutions Architect"
                    />
                  </div>
                  
                  <div className="col-span-3">
                    <SectionLabel>Month &amp; Year</SectionLabel>
                    <div className="flex gap-2">
                      {(() => {
                        const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        const currentYear = new Date().getFullYear();
                        const YEARS = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());
                        const parts = (parsed.date || "").split(" ");
                        const selMonth = parts.length === 2 ? parts[0] : "";
                        const selYear  = parts.length === 2 ? parts[1] : parts[0] || "";
                        const setDate = (m: string, y: string) => {
                          updatePart("date", m && y ? `${m} ${y}` : y || m);
                        };
                        return (
                          <>
                            <select
                              value={selMonth}
                              onChange={(e) => setDate(e.target.value, selYear)}
                              className="flex-1 bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] rounded-xl px-3 py-2.5 text-[13px] text-[var(--sclade-text-primary)] outline-none focus:border-blue-500/40 transition-all font-semibold cursor-pointer"
                            >
                              <option value="" className="bg-[var(--sclade-popover-bg)] text-[var(--sclade-text-primary)]">Month</option>
                              {MONTHS.map((m) => (
                                <option key={m} value={m} className="bg-[var(--sclade-popover-bg)] text-[var(--sclade-text-primary)]">{m}</option>
                              ))}
                            </select>
                            <select
                              value={selYear}
                              onChange={(e) => setDate(selMonth, e.target.value)}
                              className="flex-1 bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] rounded-xl px-3 py-2.5 text-[13px] text-[var(--sclade-text-primary)] outline-none focus:border-blue-500/40 transition-all font-semibold cursor-pointer"
                            >
                              <option value="" className="bg-[var(--sclade-popover-bg)] text-[var(--sclade-text-primary)]">Year</option>
                              {YEARS.map((y) => (
                                <option key={y} value={y} className="bg-[var(--sclade-popover-bg)] text-[var(--sclade-text-primary)]">{y}</option>
                              ))}
                            </select>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="col-span-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <SectionLabel>Verification Link (URL)</SectionLabel>
                      <button
                        type="button"
                        onClick={autoFill}
                        disabled={!parsed.url?.trim() || achFetching[idx]}
                        className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        {achFetching[idx]
                          ? <><Loader2 className="w-3 h-3 animate-spin" /> Fetching…</>
                          : <><Sparkles className="w-3 h-3" /> Auto-fill</>}
                      </button>
                    </div>
                    <InlineEdit
                      value={parsed.url || ""}
                      onChange={(v) => { updatePart("url", v); setAchNote((p) => ({ ...p, [idx]: "" })); }}
                      placeholder="e.g. credly.com/badges/abc or drive.google.com/..."
                    />
                    {achNote[idx] ? (
                      <p className={`mt-1.5 text-[10px] font-semibold ${achNote[idx].startsWith("✓") ? "text-emerald-500" : "text-amber-500"}`}>
                        {achNote[idx]}
                      </p>
                    ) : parsed.url?.trim() ? (
                      <p className="mt-1 text-[10px] text-neutral-600">Tap ✨ Auto-fill to extract title &amp; date from this link.</p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────
  // Tab: Mastery (Skills)
  // ─────────────────────────────────────────────
  const renderSkills = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* GitHub Sync Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-transparent dark:from-blue-900/20 dark:via-indigo-900/10 border border-blue-500/15 rounded-2xl p-5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GitBranch className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">GitHub Skill Sync</span>
            </div>
            <p className="text-[10px] text-[var(--sclade-text-secondary)] leading-relaxed max-w-[220px]">
              Scans your repos &amp; README files to auto-discover technologies you've actually used.
            </p>
          </div>
          <button
            onClick={handleSuggestSkills}
            disabled={suggestingSkills}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 shadow-lg shadow-blue-600/25 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
          >
            {suggestingSkills ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <GitBranch className="w-3.5 h-3.5" />
            )}
            {suggestingSkills ? "Scanning..." : "Sync from GitHub"}
          </button>
        </div>
      </div>

      {/* Skill Categories */}
      {(["languages", "frameworks", "tools"] as (keyof CVSkills)[]).map((type) => {
        const labels: Record<string, string> = {
          languages: "Languages",
          frameworks: "Frameworks & Libraries",
          tools: "Tools & Platforms",
        };
        const placeholders: Record<string, string> = {
          languages: "e.g. Python, TypeScript, Go...",
          frameworks: "e.g. React, FastAPI, TensorFlow...",
          tools: "e.g. Docker, PostgreSQL, AWS...",
        };
        const colors: Record<string, string> = {
          languages: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20 hover:bg-violet-500/20",
          frameworks: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20 hover:bg-sky-500/20",
          tools: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20",
        };
        const dotColors: Record<string, string> = {
          languages: "bg-violet-600 dark:bg-violet-400",
          frameworks: "bg-sky-600 dark:bg-sky-400",
          tools: "bg-emerald-600 dark:bg-emerald-400",
        };

        return (
          <div key={type} className="space-y-3">
            {/* Category Header */}
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${dotColors[type]}`} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
                {labels[type]}
              </span>
              <span className="text-[9px] text-neutral-700 font-bold">
                ({(skills[type] || []).length})
              </span>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] rounded-xl transition-all focus-within:border-[var(--sclade-popover-border)]">
              {(skills[type] || []).map((s, i) => (
                <span
                  key={i}
                  className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all ${colors[type]}`}
                >
                  {s}
                  <button
                    onClick={() => removeSkill(type, i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-current hover:text-red-400"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {(skills[type] || []).length === 0 && (
                <span className="text-[10px] text-neutral-700 italic font-medium self-center">
                  No {labels[type].toLowerCase()} added yet
                </span>
              )}
            </div>

            {/* Add Input */}
            <div className="relative group">
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val) {
                      // Handle comma-separated batch input
                      const parts = val.split(",").map(v => v.trim()).filter(Boolean);
                      parts.forEach(part => addSkill(type, part));
                      e.currentTarget.value = "";
                    }
                  }
                }}
                placeholder={placeholders[type]}
                className="w-full bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] rounded-xl px-3.5 py-2.5 text-[11px] text-[var(--sclade-text-primary)] placeholder:text-[var(--sclade-text-muted)] outline-none focus:border-blue-500/40 transition-all font-medium"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <kbd className="text-[8px] font-bold text-[var(--sclade-text-muted)] bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] px-1.5 py-0.5 rounded">Enter</kbd>
              </div>
            </div>
          </div>
        );
      })}

      {/* Skill validation runs silently in background */}

      {/* Smart Updates — GitHub AI suggestions below */}
      <div className="pt-6 border-t border-white/[0.04]">
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-neutral-600 mb-4 px-1">Smart Skill Updates</p>
        <SmartUpdateCenter
          initialSuggestions={initialSuggestions}
          accessToken={accessToken}
          lastSyncAt={initialData.lastSyncAt || null}
          setProjects={setProjects}
          setSkills={setSkills}
          setIsSyncing={setIsSyncing}
          isSyncing={isSyncing}
          filterType="skill"
        />
      </div>
    </div>
  );

  // ─────────────────────────────────────────────
  // Tab: Trajectory (Experience)
  // ─────────────────────────────────────────────
  const renderExperience = () => (
    <div className="space-y-6">
      {cv.experience.length === 0 && (
        <div className="text-center py-16 bg-[var(--sclade-input-bg)] border border-dashed border-[var(--sclade-input-border)] rounded-[2rem] shadow-inner">
          <Briefcase className="w-10 h-10 text-neutral-800 mx-auto mb-4 stroke-[1.5]" />
          <p className="text-neutral-600 text-sm font-bold mb-4 uppercase tracking-[2px]">Empty Trajectory</p>
          <button
            onClick={addExperience}
            className="px-8 py-3 bg-[var(--sclade-btn-secondary-bg)] rounded-2xl text-[10px] font-black uppercase text-[var(--sclade-text-secondary)] hover:text-[var(--sclade-text-primary)] transition-all border border-[var(--sclade-popover-border)]"
          >
            Add Experience
          </button>
        </div>
      )}

      {experience.map((exp, i) => {
        const isCurrentlyDragged = draggedExpIdx === i;
        const isDraggedOver = dragOverExpIdx === i;

        return (
          <div
            key={`exp-${i}`}
            onDragOver={(e) => {
              e.preventDefault();
              if (draggedExpIdx === null || draggedExpIdx === i) return;
              setDragOverExpIdx(i);
            }}
            onDragLeave={() => {
              setDragOverExpIdx(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const sourceIdx = parseInt(e.dataTransfer.getData("text/plain"), 10);
              if (isNaN(sourceIdx) || sourceIdx === i) return;

              const updated = [...experience];
              const [removed] = updated.splice(sourceIdx, 1);
              updated.splice(i, 0, removed);
              setExperience(updated);

              setDraggedExpIdx(null);
              setDragOverExpIdx(null);
              isDirty.current = true;
              saveCV();
            }}
            className={`bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] rounded-[2rem] overflow-hidden group hover:border-blue-500/20 transition-all duration-300 shadow-lg ${
              isCurrentlyDragged
                ? "opacity-30 border-blue-500/50 scale-[0.98]"
                : isDraggedOver
                ? "border-blue-500 bg-blue-500/5 translate-y-1"
                : ""
            }`}
          >
            <div 
              onClick={() => setExpandedExperience(expandedExperience === i ? null : i)}
              className="px-6 py-4 flex items-center justify-between bg-[var(--sclade-glass-tint)] cursor-pointer hover:opacity-90 transition-all border-b border-[var(--sclade-card-border)] relative group/header"
            >
              {/* Drag Handle Indicator */}
              <div 
                draggable={true}
                onDragStart={(e) => {
                  e.stopPropagation();
                  setDraggedExpIdx(i);
                  e.dataTransfer.setData("text/plain", i.toString());
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={(e) => {
                  e.stopPropagation();
                  setDraggedExpIdx(null);
                  setDragOverExpIdx(null);
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent toggling accordion when clicking/dragging the grip handle
                }}
                className="mr-3 text-neutral-600 group-hover/header:text-neutral-400 cursor-grab active:cursor-grabbing transition-colors self-center flex items-center h-full p-1 hover:bg-neutral-800/30 rounded"
              >
                <GripVertical className="w-4 h-4 shrink-0" />
              </div>

              <div className="flex-1 min-w-0 mr-3">
                <p className="text-sm font-bold text-[var(--sclade-text-primary)] truncate font-outfit">{exp.company || "New Experience"}</p>
                <div className="flex items-center gap-2 mt-0.5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-[var(--sclade-text-muted)] group-hover:text-blue-500 transition-colors uppercase truncate">{exp.title || "Position"}</p>
                   <span className="w-1 h-1 rounded-full bg-neutral-800" />
                   <p className="text-[10px] font-bold text-[var(--sclade-text-muted)] truncate">{exp.period || "No Dates Set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => removeExperience(i)} 
                  className="p-2 text-neutral-700 hover:text-red-400 hover:bg-red-500/5 transition-all rounded-xl"
                  title="Delete Experience"
                >
                   <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setExpandedExperience(expandedExperience === i ? null : i)}
                  className="p-2 text-[var(--sclade-text-secondary)] hover:text-[var(--sclade-text-primary)] hover:bg-[var(--sclade-input-bg)] rounded-xl transition-all"
                  title={expandedExperience === i ? "Collapse" : "Expand"}
                >
                  {expandedExperience === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          
          {expandedExperience === i && (
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <SectionLabel>Company / Organization</SectionLabel>
                  <InlineEdit value={exp.company} onChange={(v) => updateExp(i, "company", v)} placeholder="Company Name" />
                </div>
                <div className="col-span-2">
                  <SectionLabel>Dates / Period</SectionLabel>
                  <ExperienceDatePicker value={exp.period} onChange={(v) => updateExp(i, "period", v)} />
                </div>
                <div className="col-span-2">
                  <SectionLabel>Job Title</SectionLabel>
                  <InlineEdit value={exp.title} onChange={(v) => updateExp(i, "title", v)} placeholder="Software Engineer / Technical Lead" />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <SectionLabel>Achievements & Responsibilities</SectionLabel>
                  <div className="flex items-center gap-2">
                    {(experience[i]?.bullets?.length || 0) < 3 ? (
                      <button
                        onClick={() => addExpBullet(i)}
                        className="text-[9px] font-black uppercase tracking-widest text-neutral-600 hover:text-white flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-lg transition-all"
                      >
                        <Plus className="w-3 h-3" /> Outcome
                      </button>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-600/60 px-2.5 py-1 rounded-lg border border-amber-600/20 bg-amber-600/5">
                        Max 3 bullets
                      </span>
                    )}
                    <button
                      onClick={() => handleGenerateExpBullets(i)}
                      disabled={generatingExpBullets === i}
                      className="text-[9px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/15 px-2.5 py-1 rounded-lg transition-all border border-blue-500/10 disabled:opacity-50"
                    >
                      {generatingExpBullets === i ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      {generatingExpBullets === i ? "Generating..." : "✦ AI Generate"}
                    </button>
                  </div>
                </div>
                {/* Optional context hint for better AI output */}
                <div className="mb-3">
                  <input
                    value={expContext[i] || ""}
                    onChange={(e) => setExpContext(prev => ({ ...prev, [i]: e.target.value }))}
                    placeholder="Optional: hint the AI (e.g. 'Built ML dashboard, used Streamlit and Python')..."
                    className="w-full bg-transparent border-b border-white/5 px-2 py-2 text-[11px] text-neutral-500 placeholder:text-neutral-700 outline-none focus:border-blue-500/30 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  {exp.bullets.map((b, j) => (
                    <div key={j} className="flex gap-3 items-start group/bullet">
                      <div className="mt-4 w-1.5 h-1.5 rounded-full bg-neutral-800 shrink-0 group-hover/bullet:bg-blue-500 transition-colors shadow-[0_0_8px_rgba(37,99,235,0)] group-hover/bullet:shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                      <InlineEdit
                        value={b}
                        onChange={(v) => updateExpBullet(i, j, v)}
                        placeholder="Achieved X by implementing Y resulting in Z% growth."
                        multiline
                        rows={2}
                        className="flex-1 text-[13px]"
                      />
                      <button
                        onClick={() => removeExpBullet(i, j)}
                        className="mt-3 text-neutral-800 hover:text-red-400 transition-all opacity-0 group-hover/bullet:opacity-100 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    })}

      {experience.length < 3 ? (
        <button
          onClick={addExperience}
          className="w-full h-20 flex flex-col items-center justify-center gap-1 border border-dashed border-white/5 hover:border-blue-500/30 bg-white/[0.01] hover:bg-blue-500/5 rounded-[2rem] text-neutral-600 hover:text-blue-400 transition-all duration-300 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[2px]">Add Experience</span>
        </button>
      ) : (
        <div className="w-full h-14 flex items-center justify-center gap-2 border border-dashed border-amber-600/20 bg-amber-600/5 rounded-[2rem]">
          <span className="text-[10px] font-black uppercase tracking-[2px] text-amber-600/70">Max 3 experience entries — remove one to add another</span>
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────
  // Tab: Projects
  // ─────────────────────────────────────────────
  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-neutral-500">Live Builds</p>
          {isSyncing && (
            <div className="flex items-center gap-2 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md">
              <Loader2 className="w-2 h-2 text-blue-400 animate-spin" />
              <span className="text-[8px] font-black uppercase tracking-widest text-blue-400">Syncing...</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.location.reload()}
            className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {projects.map((p, pIdx) => {
        const isCurrentlyDragged = draggedProjectIdx === pIdx;
        const isDraggedOver = dragOverProjectIdx === pIdx;

        return (
          <div
            key={p.id}
            onDragOver={(e) => {
              e.preventDefault();
              if (draggedProjectIdx === null || draggedProjectIdx === pIdx) return;
              setDragOverProjectIdx(pIdx);
            }}
            onDragLeave={() => {
              setDragOverProjectIdx(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const sourceIdx = parseInt(e.dataTransfer.getData("text/plain"), 10);
              if (isNaN(sourceIdx) || sourceIdx === pIdx) return;
              
              const updated = [...projects];
              const [removed] = updated.splice(sourceIdx, 1);
              updated.splice(pIdx, 0, removed);
              setProjects(updated);
              
              setDraggedProjectIdx(null);
              setDragOverProjectIdx(null);
              isDirty.current = true;
              saveCV();
            }}
            className={`border rounded-[2rem] overflow-hidden transition-all duration-300 shadow-xl ${
              isCurrentlyDragged 
                ? "opacity-30 border-blue-500/50 scale-[0.98]" 
                : isDraggedOver
                ? "border-blue-500 bg-blue-500/5 translate-y-1"
                : p.included === false
                ? "border-[var(--sclade-card-border)] bg-[var(--sclade-input-bg)] opacity-40 hover:opacity-70 scale-[0.98]"
                : "border-[var(--sclade-card-border)] bg-[var(--sclade-card-bg)] hover:border-blue-500/30"
            }`}
          >
            <div
              className="px-7 py-5 flex items-center justify-between cursor-pointer group/header relative"
              onClick={() => setExpandedProject(expandedProject === pIdx ? null : pIdx)}
            >
              {/* Drag Handle Indicator */}
              <div 
                draggable={true}
                onDragStart={(e) => {
                  e.stopPropagation();
                  setDraggedProjectIdx(pIdx);
                  e.dataTransfer.setData("text/plain", pIdx.toString());
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnd={(e) => {
                  e.stopPropagation();
                  setDraggedProjectIdx(null);
                  setDragOverProjectIdx(null);
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent toggling accordion when clicking/dragging the grip handle
                }}
                className="mr-3 text-neutral-600 group-hover/header:text-neutral-400 cursor-grab active:cursor-grabbing transition-colors self-center flex items-center h-full p-1 hover:bg-neutral-800/30 rounded"
              >
                <GripVertical className="w-4 h-4 shrink-0" />
              </div>

              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-3">
                  <p className="text-[15px] font-bold text-[var(--sclade-text-primary)] truncate font-outfit tracking-tight">{p.title || "Untitled Project"}</p>
                  {p.included === false && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-lg border border-[var(--sclade-popover-border)]">Excluded</span>}
                  {p.aiGenerated && <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/10">AI</span>}
                  {((p as any).needsReview || !p.highlights || p.highlights.filter((h: any) => h && h.trim().length > 0).length === 0) && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                      Needs your input
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-neutral-600 mt-1">{(p.techStack || []).join(" • ")}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); updateProject(pIdx, "included", !p.included); }}
                  className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all border ${p.included === false ? "text-neutral-700 bg-white/5 border-white/5" : "text-blue-400 bg-blue-500/5 border-blue-500/10"}`}
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Delete this project?")) {
                      setProjects(projects.filter((_, i) => i !== pIdx));
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className={`w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] text-[var(--sclade-text-secondary)] transition-all duration-300 ${expandedProject === pIdx ? 'rotate-180' : ''}`}>
                   <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            {expandedProject === pIdx && (
              <div className="p-7 space-y-6 border-t border-white/5 animate-in slide-in-from-top-4 duration-300">
                <div className={`grid ${isNarrowLeft ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
                  <div>
                    <SectionLabel>Project Title</SectionLabel>
                    <InlineEdit value={p.title} onChange={(v) => updateProject(pIdx, "title", v)} placeholder="Project Title" />
                  </div>
                  <div>
                    <SectionLabel>Tech Stack</SectionLabel>
                  <InlineEdit 
                    value={Array.isArray(p.techStack) ? p.techStack.join(", ") : (p.techStack || "")} 
                    onChange={(v) => updateProject(pIdx, "techStack", v.split(",").map(t => t.trim()).filter(Boolean))} 
                    placeholder="React, TypeScript, ..." 
                  />
                  </div>
                </div>
                <div>
                  <SectionLabel>Description</SectionLabel>
                  <InlineEdit value={p.description || ""} onChange={(v) => updateProject(pIdx, "description", v)} placeholder="A brief technical overview..." />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <SectionLabel>Project Highlights</SectionLabel>
                    <div className="flex items-center gap-2">
                      {(p.highlights || []).length < 2 ? (
                        <button onClick={() => { const nu = [...(p.highlights || []), ""]; updateProject(pIdx, "highlights", nu); }} className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors mr-1">+ Add Bullet</button>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-600/60 px-2 py-0.5 rounded border border-amber-600/20 bg-amber-600/5">Max 2</span>
                      )}
                      <button
                        onClick={() => handleGenerateProjectFromReadme(pIdx)}
                        disabled={generatingProjectFromReadme === pIdx}
                        className="text-[9px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/15 px-2.5 py-1 rounded-lg transition-all border border-blue-500/10 disabled:opacity-50"
                      >
                        {generatingProjectFromReadme === pIdx ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        {generatingProjectFromReadme === pIdx ? "Syncing..." : "✦ Sync README"}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {(p.highlights || []).map((h, bIdx) => (
                      <div key={bIdx} className="flex gap-2 group/bullet">
                        <div className="flex-1">
                          <InlineEdit value={h} onChange={(v) => { const nu = [...(p.highlights || [])]; nu[bIdx] = v; updateProject(pIdx, "highlights", nu); }} placeholder="Describe achievement..." multiline />
                        </div>
                        <button onClick={() => { const nu = (p.highlights || []).filter((_, i) => i !== bIdx); updateProject(pIdx, "highlights", nu); }} className="opacity-0 group-hover/bullet:opacity-100 p-2 text-neutral-600 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {projects.length === 0 && (
        <div className="text-center py-16 bg-[var(--sclade-input-bg)] border border-dashed border-[var(--sclade-input-border)] rounded-[2rem]">
          <Terminal className="w-10 h-10 text-neutral-800 mx-auto mb-4 stroke-[1.5]" />
          <p className="text-neutral-600 text-sm font-bold mb-4 uppercase tracking-[2px]">No Active Builds</p>
          <button onClick={() => setProjects([{ id: Math.random().toString(), title: "", description: "", techStack: [], highlights: [""] }])} className="px-8 py-3 bg-[var(--sclade-btn-secondary-bg)] rounded-2xl text-[10px] font-black uppercase text-[var(--sclade-text-secondary)] hover:text-[var(--sclade-text-primary)] transition-all border border-[var(--sclade-popover-border)]">Initiate Project</button>
        </div>
      )}
      {projects.length > 0 && projects.filter(p => p.included !== false).length < 3 && (
        <button
          onClick={() => setProjects([...projects, { id: Math.random().toString(), title: "", description: "", techStack: [], highlights: [""] }])}
          className="w-full h-16 flex flex-col items-center justify-center gap-1 border border-dashed border-[var(--sclade-popover-border)] hover:border-blue-500/30 bg-[var(--sclade-glass-tint)] hover:bg-blue-500/5 rounded-[2rem] text-[var(--sclade-text-muted)] hover:text-blue-500 transition-all duration-300 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[2px]">Add Project</span>
        </button>
      )}
      {projects.length > 0 && projects.filter(p => p.included !== false).length >= 3 && (
        <div className="w-full h-14 flex items-center justify-center gap-2 border border-dashed border-amber-600/20 bg-amber-600/5 rounded-[2rem]">
          <span className="text-[10px] font-black uppercase tracking-[2px] text-amber-600/70">Max 3 projects — exclude or remove one to add another</span>
        </div>
      )}

      <div className="pt-8 border-t border-white/5">
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-neutral-500 mb-4 px-2">Smart Project Updates</p>
        <SmartUpdateCenter 
          initialSuggestions={initialSuggestions} 
          accessToken={accessToken} 
          lastSyncAt={initialData.lastSyncAt || null} 
          setProjects={setProjects}
          setSkills={setSkills}
          setIsSyncing={setIsSyncing}
          isSyncing={isSyncing}
          filterType="project"
        />
      </div>
    </div>
  );


  // ─────────────────────────────────────────────
  // Tab: Tailor
  // ─────────────────────────────────────────────
  const renderTailor = () => {
    if (activeJobTarget) {
      const matchScore = activeJobTarget.matchScore || 0;
      const matchedKeywords = ensureArray<string>(activeJobTarget.keywords);
      const missingSkills = ensureArray<string>(activeJobTarget.missingSkills);

      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass-panel p-8 rounded-[2.5rem] bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5 mb-6">
              <div>
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[9px] font-bold uppercase tracking-widest">Active Tailored Version</span>
                <h3 className="text-xl font-bold mt-1 text-[var(--sclade-text-primary)] font-outfit">{activeJobTarget.title || "Tailored Position"}</h3>
                <p className="text-xs text-[var(--sclade-text-secondary)] mt-1">This resume version is optimized specifically for this role.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
                <button
                  onClick={handleResetToMain}
                  className="px-4 py-2.5 bg-neutral-500/10 hover:bg-neutral-500/20 border border-neutral-500/20 text-neutral-400 font-bold text-xs rounded-xl transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap flex-1 sm:flex-initial text-center justify-center"
                >
                  Reset to Main Profile
                </button>
                <button
                  onClick={handleReanalyze}
                  disabled={isTailoring}
                  className="px-4 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 font-bold text-xs rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 font-outfit whitespace-nowrap flex-1 sm:flex-initial text-center"
                >
                  {isTailoring ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  {isTailoring ? "Analyzing..." : "Analyze Again"}
                </button>
                <button
                  onClick={() => {
                    setTailorJobTitle("");
                    setTailorJdText("");
                    setTailorBaseOption("clone");
                    setShowTailorModal(true);
                  }}
                  className="px-4 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 font-bold text-xs rounded-xl transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap flex-1 sm:flex-initial text-center justify-center"
                >
                  Tailor for a New Job
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Score and Status (Sticky Sidebar) */}
              <div className="md:col-span-4 space-y-4 md:sticky md:top-6 h-fit">
                {/* Score Indicator */}
                <div className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-neutral-800"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-blue-500 transition-all duration-1000"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * matchScore) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-2xl font-black font-outfit">{matchScore}%</span>
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-4 font-outfit">Match Strength</h4>
                </div>

                {/* CV Alignment Status Card */}
                <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl text-left">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-1.5 font-outfit">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    CV Alignment Status
                  </h4>
                  <p className="text-xs text-[var(--sclade-text-secondary)] leading-relaxed font-medium">
                    Experience bullets, project descriptions, and skills are fully synchronized with the target job requirements.
                  </p>
                </div>
              </div>

              {/* Match Stats */}
              <div className="md:col-span-8 space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Matched Keywords ({matchedKeywords.length})
                  </h4>
                  {matchedKeywords.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2.5 max-h-[250px] overflow-y-auto custom-scrollbar pr-2.5 pb-1">
                      {matchedKeywords.map((kw, i) => {
                        const parsed = parseSkillEvidence(kw);
                        return (
                          <div key={i} className="w-full p-3 bg-emerald-500/5 border border-emerald-500/10 dark:border-emerald-500/5 rounded-xl flex flex-col gap-1 text-left">
                            <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 leading-none font-outfit">
                              ✓ {parsed.title}
                            </span>
                            {parsed.detail && (
                              <span className="text-[9.5px] text-[var(--sclade-text-secondary)] leading-normal font-medium">
                                {parsed.detail}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500">No matched keywords found.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Missing Skills ({missingSkills.length})
                  </h4>
                  {missingSkills.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2.5 max-h-[350px] overflow-y-auto custom-scrollbar pr-2.5 pb-1">
                      {missingSkills.map((sk, i) => {
                        const parsed = parseSkillEvidence(sk);
                        return (
                          <div key={i} className="w-full p-3 bg-amber-500/5 border border-amber-500/10 dark:border-amber-500/5 rounded-xl flex flex-col gap-1 text-left">
                            <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-500 flex items-center gap-1.5 leading-none">
                              ⚠ {parsed.title}
                            </span>
                            {parsed.detail && (
                              <span className="text-[9.5px] text-[var(--sclade-text-secondary)] leading-normal font-medium">
                                {parsed.detail}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500">Zero missing skills! Perfect stack alignment.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[1.5rem]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Automated CV Alignment Status</h4>
            <p className="text-xs text-[var(--sclade-text-secondary)] leading-relaxed">
              Experience bullets and project descriptions have been re-phrased to emphasize your matching credentials. The resume profile and skills grid are fully synchronized with the target requirements.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-blue-500/[0.04] border border-blue-500/10 dark:border-blue-500/5 rounded-[2rem] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none" />
          <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-2 font-outfit">Job Description Specializer</h3>
          <p className="text-sm text-blue-700/70 dark:text-blue-200/60 leading-relaxed mb-6 font-medium">
            Paste the job description below. Our AI will align your summary, skills, and projects to match the recruiter's specific requirements.
          </p>

          <div className="space-y-5">
            <div>
              <SectionLabel>Target Job Title</SectionLabel>
              <input 
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] text-[var(--sclade-text-primary)] placeholder:text-[var(--sclade-text-muted)] rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500/40 transition-all font-medium"
              />
            </div>
            <div>
              <SectionLabel>Full Job Description</SectionLabel>
              <textarea 
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the JD here..."
                rows={10}
                className="w-full bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] text-[var(--sclade-text-primary)] placeholder:text-[var(--sclade-text-muted)] rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500/40 transition-all resize-none font-medium"
              />
            </div>
            
            <button
              onClick={handleTailorResume}
              disabled={isTailoring || !jdText}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] cursor-pointer"
            >
              {isTailoring ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {isTailoring ? "Orchestrating Tailored Version..." : "Generate Optimized Version"}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="p-6 bg-white/5 border border-white/5 rounded-[1.5rem]">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Benefit 01</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">Keywords are automatically injected into your skills and summary to pass ATS filters.</p>
           </div>
           <div className="p-6 bg-white/5 border border-white/5 rounded-[1.5rem]">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Benefit 02</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">Your professional summary is rewritten to solve the specific pain points mentioned in the JD.</p>
           </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "skills", label: "Skills", icon: <Cpu className="w-4 h-4" /> },
    { id: "experience", label: "Experience", icon: <Briefcase className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <Code2 className="w-4 h-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "tailor", label: "Match Job", icon: <Sparkles className="w-4 h-4" /> },
  ];

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-[#F5F6F8] dark:bg-neutral-950 text-[#202124] dark:text-neutral-100 overflow-hidden font-sans selection:bg-blue-500/20">
      {/* ── Top Application Header ── */}
      <header className="h-16 shrink-0 bg-white dark:bg-neutral-900 border-b border-[#DADCE0] dark:border-neutral-800 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 6C7 4.34315 8.34315 3 10 3H19L25 9V26C25 27.6569 23.6569 29 22 29H10C8.34315 29 7 27.6569 7 26V6Z" fill="#1A73E8" />
              <path d="M19 3V9H25L19 3Z" fill="#1557B0" opacity="0.8" />
              <path d="M11 13H17M11 17H21M11 21H18M11 25H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M20 8.5L25 3.5" stroke="#1A73E8" strokeWidth="2" strokeLinecap="round" />
              <path d="M25 3.5L27 6.5L23.5 5.5Z" fill="#1A73E8" />
            </svg>
            <span className="font-extrabold text-base tracking-tight text-[#202124] dark:text-white font-outfit">
              RESUMMIT
            </span>
          </Link>

          <div className="h-5 w-px bg-[#DADCE0] dark:bg-neutral-800 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="font-bold text-sm text-[#202124] dark:text-white font-outfit">Editor</span>
            </Link>
            <span className="text-xs text-neutral-400 hidden md:inline ml-2">
              Your career. Your control.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DashboardControls user={user || { name: personalInfo.name || "User", email: personalInfo.email, image: undefined }} />
        </div>
      </header>

      {/* Mobile Switcher (visible on mobile only) */}
      <div className="md:hidden flex items-center justify-around border-b border-[#DADCE0] dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2 shrink-0">
        <button
          onClick={() => setMobileTab("editor")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
            mobileTab === "editor" ? "bg-[#E8F0FE] text-[#1A73E8]" : "text-neutral-600"
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
            mobileTab === "preview" ? "bg-[#E8F0FE] text-[#1A73E8]" : "text-neutral-600"
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setMobileTab("versions")}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
            mobileTab === "versions" ? "bg-[#E8F0FE] text-[#1A73E8]" : "text-neutral-600"
          }`}
        >
          Versions
        </button>
      </div>

      {/* ── Dragging Global Overlay ── */}
      {(isDraggingLeft || isDraggingRight) && (
        <div className="fixed inset-0 z-50 cursor-col-resize select-none" />
      )}

      {/* ── Main Three-Panel Workspace ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Panel Floating Restore Button when minimized */}
        {isLeftCollapsed && (
          <button
            onClick={() => setIsLeftCollapsed(false)}
            className="fixed left-3 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-2xl active:scale-95 transition-all flex items-center justify-center cursor-pointer group animate-in fade-in"
            title="Open Editor Panel"
          >
            <PanelLeftOpen className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </button>
        )}

        {/* ── Left Editor Panel ── */}
        {!isLeftCollapsed && (
          <div
            style={{ width: windowWidth < 768 ? "100%" : `${leftWidth}px` }}
            className={`relative shrink-0 border-r border-[#DADCE0] dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col h-full overflow-hidden z-20 ${
              mobileTab !== "editor" ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Resize Handle on Right Edge */}
            <div
              onMouseDown={startLeftResizing}
              className="absolute top-0 -right-1.5 w-3 h-full cursor-col-resize z-30 group max-md:hidden hover:bg-blue-500/10 active:bg-blue-500/20"
              title="Drag to resize editor panel"
            >
              <div className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[2px] rounded-full transition-all duration-150 ${
                isDraggingLeft 
                  ? "bg-[#1A73E8] h-20 shadow-[0_0_8px_rgba(26,115,232,0.6)]" 
                  : "bg-neutral-300 dark:bg-neutral-700 group-hover:bg-[#1A73E8] h-8 group-hover:h-16"
              }`} />
            </div>

            {/* Editor Panel Toolbar */}
            <div className="px-3.5 sm:px-4 py-2.5 border-b border-[#DADCE0] dark:border-neutral-800 flex items-center justify-between gap-2 shrink-0 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Link
                  href="/dashboard"
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <h2 className="text-sm font-bold text-[#202124] dark:text-white font-outfit shrink-0">
                  Editor
                </h2>
                {/* Save status */}
                <div 
                  className="flex items-center gap-1.5 text-xs text-neutral-500 shrink-0"
                  title={saveStatus === "saving" ? "Saving changes..." : saveStatus === "error" ? "Save failed" : saveTimer.current ? "Unsaved changes" : "Saved just now"}
                >
                  {saveStatus === "saving" ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-[#1A73E8] shrink-0" />
                      <span className={`text-[#1A73E8] font-medium whitespace-nowrap text-[11px] ${leftWidth < 410 ? "hidden" : "inline"}`}>Saving...</span>
                    </>
                  ) : saveStatus === "error" ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      <span className={`text-red-500 font-medium whitespace-nowrap text-[11px] ${leftWidth < 410 ? "hidden" : "inline"}`}>Save failed</span>
                    </>
                  ) : saveTimer.current ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span className={`text-amber-500 font-medium whitespace-nowrap text-[11px] ${leftWidth < 410 ? "hidden" : "inline"}`}>Unsaved</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className={`text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap text-[11px] ${leftWidth < 410 ? "hidden" : "inline"}`}>Saved</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    if (confirm("Revert unsaved changes and reload editor?")) {
                      window.location.reload();
                    }
                  }}
                  className="p-1.5 rounded-lg border border-[#DADCE0] dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer shrink-0"
                  title="Revert / Reload"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setAtsPanelOpen(true)}
                  className="p-1.5 rounded-lg border border-[#DADCE0] dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[#1A73E8] transition-all cursor-pointer shrink-0"
                  title="ATS Scoring & AI Audit"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (saveTimer.current) {
                      clearTimeout(saveTimer.current);
                      saveTimer.current = null;
                    }
                    saveCV();
                  }}
                  disabled={saveStatus === "saving"}
                  className="flex items-center gap-1.5 bg-[#1A73E8] hover:bg-[#1557B0] active:scale-95 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer shrink-0"
                  title="Save Resume"
                >
                  {saveStatus === "saving" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5 stroke-[2.2]" />
                  )}
                  <span>Save</span>
                </button>

                <button
                  onClick={() => setIsLeftCollapsed(true)}
                  className="p-1.5 rounded-lg border border-[#DADCE0] dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all cursor-pointer shrink-0"
                  title="Minimize editor panel"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Section Tabs */}
            <div className={`px-2.5 py-2 border-b border-[#DADCE0] dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0 ${
              isNarrowLeft ? "grid grid-cols-3 gap-1.5" : "grid grid-cols-6 gap-1"
            }`}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as EditorTab)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#E8F0FE] text-[#1A73E8] font-semibold border border-blue-200/80 shadow-xs dark:bg-blue-950/60 dark:border-blue-800/80 dark:text-blue-300"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 border border-transparent"
                    }`}
                  >
                    <span className={isActive ? "text-[#1A73E8] dark:text-blue-300" : "text-neutral-500 dark:text-neutral-400"}>
                      {tab.icon}
                    </span>
                    <span className="text-[11px] mt-1 leading-none text-center font-medium truncate w-full">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* CV Warnings Banner if any */}
            <CvWarningBanner />

            {/* Tab Context Window (Form Content) */}
            <div className="flex-1 overflow-y-auto p-5 pb-24 custom-scrollbar">
              {activeTab === "profile" && renderProfile()}
              {activeTab === "skills" && renderSkills()}
              {activeTab === "experience" && renderExperience()}
              {activeTab === "projects" && renderProjects()}
              {activeTab === "education" && renderEducation()}
              {activeTab === "tailor" && renderTailor()}
            </div>
          </div>
        )}

        {/* ── Center Preview Workspace ── */}
        <div className={`flex-1 min-w-0 bg-[#F5F6F8] dark:bg-neutral-950 flex flex-col h-full overflow-hidden relative ${
          mobileTab !== "preview" ? "hidden md:flex" : "flex"
        }`}>
          {/* Preview Toolbar */}
          <div className="py-2.5 px-6 flex items-center justify-between border-b border-[#DADCE0] dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md z-10 shrink-0">
            {/* Left: Page navigation & Left sidebar toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLeftCollapsed(prev => !prev)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  !isLeftCollapsed 
                    ? "bg-blue-50 text-[#1A73E8] border-blue-200 dark:bg-blue-900/30 dark:border-blue-800" 
                    : "bg-white text-neutral-600 border-[#DADCE0] dark:bg-neutral-800 dark:border-neutral-700 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title={isLeftCollapsed ? "Open Editor Panel" : "Minimize Editor Panel"}
              >
                {isLeftCollapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
                <span className="text-[11px] font-semibold hidden sm:inline">Editor</span>
              </button>

              <div className="flex items-center gap-1 bg-white dark:bg-neutral-800 px-2 py-1 rounded-lg border border-[#DADCE0] dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-300">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Previous page"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-medium px-1 select-none">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Next page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Middle: PDF Export */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-neutral-800 border border-[#DADCE0] dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs font-medium rounded-lg text-neutral-700 dark:text-neutral-200 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>Export PDF</span>
              </button>
            </div>

            {/* Right: Zoom, Fullscreen & Versions Sidebar Toggle */}
            <div className="flex items-center gap-2">
              <select
                value={zoomOption}
                onChange={(e) => setZoomOption(e.target.value)}
                className="bg-white dark:bg-neutral-800 border border-[#DADCE0] dark:border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-neutral-700 dark:text-neutral-200 outline-none cursor-pointer font-medium shadow-xs"
              >
                <option value="fit">Fit ({Math.round(previewScale * 100)}%)</option>
                <option value="50">50%</option>
                <option value="75">75%</option>
                <option value="90">90%</option>
                <option value="100">100%</option>
                <option value="125">125%</option>
              </select>

              <button
                onClick={() => setIsFullscreen(f => !f)}
                className="p-1.5 rounded-lg border border-[#DADCE0] dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all shadow-xs cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsRightCollapsed(prev => !prev)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  !isRightCollapsed 
                    ? "bg-blue-50 text-[#1A73E8] border-blue-200 dark:bg-blue-900/30" 
                    : "bg-white text-neutral-600 border-[#DADCE0] dark:bg-neutral-800 dark:border-neutral-700"
                }`}
                title={isRightCollapsed ? "Show Resume Versions" : "Hide Resume Versions"}
              >
                <History className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Centered Document Canvas with Auto-fit Responsive Container */}
          <div
            ref={previewContainerRef}
            className="flex-1 overflow-auto p-4 md:p-6 flex flex-col items-center custom-scrollbar"
          >
            <div
              style={{
                width: `${Math.round(794 * previewScale)}px`,
                minHeight: `${Math.round(1123 * previewScale)}px`,
              }}
              className="shrink-0 relative my-auto md:my-4 transition-[width,min-height] duration-150"
            >
              <div
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                  width: "794px",
                  minHeight: "1123px",
                }}
                className="bg-white text-black shadow-lg rounded-sm border border-neutral-200/80"
              >
                <ResumePreview 
                  data={cv} 
                  projects={projects} 
                  template="formal"
                  mode={mode}
                  generatingStates={{
                    summary: regeneratingSummary,
                    skills: suggestingSkills,
                    experienceIndex: generatingExpBullets,
                    projectIndex: generatingProjectFromReadme,
                    rewritingBullet: rewritingBullet,
                    isTailoring: isTailoring,
                  }}
                  suggestions={{
                    summary: suggestedSummary,
                    projectBullets: suggestedProjectBullets,
                  }}
                  onAcceptSuggestion={handleAcceptSuggestion}
                  onDiscardSuggestion={handleDiscardSuggestion}
                  onRevertField={(field, value, index, bulletIndex) => {
                    if (field === "summary") {
                      setSummary(value);
                    } else if (field === "skills") {
                      setSkills(value);
                    } else if (field === "experience") {
                      const nu = [...experience];
                      nu[index!] = value;
                      setExperience(nu);
                    } else if (field === "projects") {
                      const nu = [...projects];
                      nu[index!] = value;
                      setProjects(nu);
                    } else if (field === "project-bullet") {
                      const nu = [...projects];
                      const highlights = [...nu[index!].highlights];
                      highlights[bulletIndex!] = value;
                      nu[index!] = { ...nu[index!], highlights };
                      setProjects(nu);
                    } else if (field === "education") {
                      const nu = [...education];
                      nu[index!] = value;
                      setEducation(nu);
                    } else if (field === "achievements") {
                      const nu = [...achievements];
                      nu[index!] = value;
                      setAchievements(nu);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Floating Restore Button when minimized */}
        {isRightCollapsed && (
          <button
            onClick={() => setIsRightCollapsed(false)}
            className="fixed right-3 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-2xl active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
            title="Open Resume Versions"
          >
            <History className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </button>
        )}

        {/* ── Right Sidebar: Versions & Tailor ── */}
        {!isRightCollapsed && (
          <div
            style={{ width: `${rightWidth}px` }}
            className={`relative shrink-0 border-l border-[#DADCE0] dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col h-full overflow-y-auto p-5 space-y-5 custom-scrollbar z-20 ${
              mobileTab !== "versions" ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Resize Handle on Left Edge */}
            <div
              onMouseDown={startRightResizing}
              className="absolute top-0 -left-1.5 w-3 h-full cursor-col-resize z-30 group max-md:hidden hover:bg-blue-500/10 active:bg-blue-500/20"
              title="Drag to resize versions panel"
            >
              <div className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[2px] rounded-full transition-all duration-150 ${
                isDraggingRight 
                  ? "bg-[#1A73E8] h-20 shadow-[0_0_8px_rgba(26,115,232,0.6)]" 
                  : "bg-neutral-300 dark:bg-neutral-700 group-hover:bg-[#1A73E8] h-8 group-hover:h-16"
              }`} />
            </div>

            {/* Panel Header with Collapse Button */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400">
                Versions & Tailoring
              </span>
              <button
                onClick={() => setIsRightCollapsed(true)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Minimize versions panel"
              >
                <PanelRightClose className="w-4 h-4" />
              </button>
            </div>

            {/* Tailor for New Job Button */}
            <button
              onClick={() => {
                setTailorJobTitle("");
                setTailorJdText("");
                setTailorBaseOption("clone");
                setShowTailorModal(true);
              }}
              className="w-full py-3 px-4 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tailor for New Job</span>
            </button>

            {/* Resume Versions Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#202124] dark:text-neutral-100">
                  Resume Versions
                </h3>
                <button 
                  onClick={() => {}} 
                  className="text-xs font-semibold text-[#1A73E8] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View all</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {/* Master Resume card */}
                <div
                  onClick={() => {
                    window.location.href = `/editor?tab=${activeTab}`;
                  }}
                  className={`w-full p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isCurrentVersionMain
                      ? "bg-[#E8F0FE] dark:bg-blue-950/40 border-2 border-[#1A73E8] dark:border-blue-500 shadow-sm"
                      : "bg-white dark:bg-neutral-800/90 border-[#DADCE0] dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isCurrentVersionMain 
                        ? "bg-white dark:bg-blue-900/60 text-[#1A73E8] dark:text-blue-300 shadow-xs" 
                        : "bg-blue-50 dark:bg-neutral-700 text-[#1A73E8] dark:text-blue-400"
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs font-bold truncate ${
                        isCurrentVersionMain 
                          ? "text-[#1A73E8] dark:text-blue-200" 
                          : "text-[#202124] dark:text-neutral-100"
                      }`}>
                        Master Resume
                      </div>
                      <div className={`text-[11px] truncate ${
                        isCurrentVersionMain 
                          ? "text-blue-600/85 dark:text-blue-300/80" 
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}>
                        Primary profile
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isCurrentVersionMain && (
                      <span className="bg-[#1A73E8] dark:bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 ${isCurrentVersionMain ? "text-[#1A73E8] dark:text-blue-300" : "text-neutral-400 dark:text-neutral-500"}`} />
                  </div>
                </div>

                {/* Tailored Resumes */}
                {versionsList.filter((v: any) => !v.isMain).map((version: any) => {
                  const isSelected = currentVersionId === version.id;
                  const title = version.jobTarget?.title || version.versionName?.replace("Tailored: ", "") || "Tailored Position";
                  const score = version.jobTarget?.matchScore || version.atsScore || 0;
                  const dateStr = new Date(version.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });

                  return (
                    <div key={version.id} className="relative group/item">
                      <div
                        onClick={() => {
                          window.location.href = `/editor?versionId=${version.id}&tab=${activeTab}`;
                        }}
                        className={`w-full p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between pr-9 ${
                          isSelected
                            ? "bg-[#E8F0FE] dark:bg-blue-950/40 border-2 border-[#1A73E8] dark:border-blue-500 shadow-sm"
                            : "bg-white dark:bg-neutral-800/90 border-[#DADCE0] dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected 
                              ? "bg-white dark:bg-blue-900/60 text-[#1A73E8] dark:text-blue-300 shadow-xs" 
                              : "bg-blue-50 dark:bg-neutral-700 text-[#1A73E8] dark:text-blue-400"
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className={`text-xs font-bold truncate ${
                              isSelected 
                                ? "text-[#1A73E8] dark:text-blue-200" 
                                : "text-[#202124] dark:text-neutral-100"
                            }`}>
                              {title}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {score}% match
                              </span>
                              <span className="text-neutral-400 dark:text-neutral-500">·</span>
                              <span className="text-neutral-500 dark:text-neutral-300 font-medium">{dateStr}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#1A73E8] dark:text-blue-300" : "text-neutral-400 dark:text-neutral-500"}`} />
                      </div>

                      {/* Delete Version Button */}
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete the tailored version for "${title}"?`)) {
                            try {
                              const res = await fetch(`/api/cv/delete-version?versionId=${version.id}`, {
                                method: "DELETE"
                              });
                              if (res.ok) {
                                setVersionsList(prev => prev.filter((v: any) => v.id !== version.id));
                                if (isSelected) {
                                  window.location.href = "/editor";
                                }
                              } else {
                                alert("Failed to delete version");
                              }
                            } catch {
                              alert("Error deleting version");
                            }
                          }
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity rounded-lg z-10 cursor-pointer"
                        title="Delete this tailored version"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}

                {versionsList.filter((v: any) => !v.isMain).length === 0 && (
                  <div className="text-center py-6 px-4 border border-dashed border-[#DADCE0] dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/30">
                    <Sparkles className="w-5 h-5 text-neutral-400 mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-neutral-500 leading-normal">
                      No tailored resumes yet. Click Tailor for New Job to optimize your CV.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Resummit Pro promotional card */}
            <div className="bg-gradient-to-br from-[#1A73E8] to-[#1557B0] text-white rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden mt-auto shrink-0">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  PRO
                </span>
                <span className="text-[11px] text-blue-100 font-medium">Coming Soon</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Resummit Pro</h4>
                <p className="text-xs text-blue-100/90 leading-relaxed mt-1">
                  Unlock real-time ATS monitoring and multi-version resume management.
                </p>
              </div>
              <button
                disabled
                className="w-full py-2 bg-white/15 border border-white/20 text-white font-medium text-xs rounded-xl cursor-default text-center"
              >
                Coming Soon
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audit Modal Reveal */}
      {atsPanelOpen && atsData && (
        <ATSPanel data={atsData} onClose={() => setAtsPanelOpen(false)} />
      )}

      {/* Specialized Coming Soon Modal */}
      {/* Premium Tailor for New Job Modal */}
      {showTailorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
          <div className="w-[500px] max-w-full bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] p-6 rounded-2xl relative overflow-hidden shadow-xl transition-all duration-300">
            <button 
              onClick={() => setShowTailorModal(false)}
              className="absolute top-5 right-5 p-1.5 text-[var(--sclade-text-muted)] hover:text-[var(--sclade-text-primary)] rounded-lg hover:bg-[var(--sclade-subtle-bg)] transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <form onSubmit={handleTailorNewJobSubmit} className="space-y-5">
              <div>
                <h3 className="font-extrabold text-xl tracking-tight text-[var(--sclade-text-primary)] font-outfit mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--sclade-primary)] stroke-[2.5]" />
                  Tailor for New Job
                </h3>
                <p className="text-[var(--sclade-text-muted)] text-[12px] font-medium leading-normal">
                  Create a new tailored version of your resume optimized for a specific role.
                </p>
              </div>

              <div className="space-y-4">
                {/* Job Title */}
                <div>
                  <SectionLabel>Target Job Title</SectionLabel>
                  <input
                    type="text"
                    required
                    value={tailorJobTitle}
                    onChange={(e) => setTailorJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] text-[var(--sclade-text-primary)] placeholder:text-[var(--sclade-text-muted)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--sclade-primary)] focus:ring-2 focus:ring-[var(--sclade-primary)]/10 transition-all font-medium"
                  />
                </div>

                {/* Job Description */}
                <div>
                  <SectionLabel>Job Description (Optional)</SectionLabel>
                  <textarea
                    value={tailorJdText}
                    onChange={(e) => setTailorJdText(e.target.value)}
                    placeholder="Paste the job description here. Our AI will automatically rewrite and align your bullets to match keywords and missing skills..."
                    rows={4}
                    className="w-full bg-[var(--sclade-input-bg)] border border-[var(--sclade-input-border)] text-[var(--sclade-text-primary)] placeholder:text-[var(--sclade-text-muted)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--sclade-primary)] focus:ring-2 focus:ring-[var(--sclade-primary)]/10 transition-all font-medium resize-none leading-relaxed"
                  />
                </div>

                {/* Method Options */}
                <div>
                  <SectionLabel>Base Content Option</SectionLabel>
                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setTailorBaseOption("clone")}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        tailorBaseOption === "clone"
                          ? "bg-[var(--sclade-selected-bg)] border-[var(--sclade-selected-border)] text-[var(--sclade-text-primary)]"
                          : "bg-transparent border-[var(--sclade-input-border)] text-[var(--sclade-text-secondary)] hover:bg-[var(--sclade-subtle-bg)]"
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${tailorBaseOption === "clone" ? "border-[var(--sclade-primary)] bg-[var(--sclade-primary)]" : "border-neutral-400"}`}>
                          {tailorBaseOption === "clone" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        Use Current CV as Base (Recommended)
                      </div>
                      <p className="text-[11px] text-[var(--sclade-text-muted)] mt-1 ml-5.5 leading-normal">
                        Pre-fills the new version with your current experiences and projects, then refines them with AI.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTailorBaseOption("scratch")}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        tailorBaseOption === "scratch"
                          ? "bg-[var(--sclade-selected-bg)] border-[var(--sclade-selected-border)] text-[var(--sclade-text-primary)]"
                          : "bg-transparent border-[var(--sclade-input-border)] text-[var(--sclade-text-secondary)] hover:bg-[var(--sclade-subtle-bg)]"
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${tailorBaseOption === "scratch" ? "border-[var(--sclade-primary)] bg-[var(--sclade-primary)]" : "border-neutral-400"}`}>
                          {tailorBaseOption === "scratch" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        Start from Scratch (Blank Slate)
                      </div>
                      <p className="text-[11px] text-[var(--sclade-text-muted)] mt-1 ml-5.5 leading-normal">
                        Creates an empty resume version (keeps contact info). Useful when writing a customized CV from a blank canvas.
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTailorModal(false)}
                  className="flex-1 py-2.5 border border-[var(--sclade-border)] bg-[var(--sclade-btn-secondary-bg)] hover:bg-[var(--sclade-input-bg)] text-[var(--sclade-text-secondary)] font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTailoredVersion}
                  className="flex-1 py-2.5 bg-[#5473D1] hover:bg-[#4261C0] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isCreatingTailoredVersion ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {tailorJdText.trim() ? "Optimize & Create" : "Create Version"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl text-white text-xs font-semibold animate-in slide-in-from-bottom-2">
          <AlertCircle className={`w-4 h-4 ${toast.type === "error" ? "text-red-400" : toast.type === "warning" ? "text-amber-400" : "text-blue-400"}`} />
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-neutral-400 hover:text-white">✕</button>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.25);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 128, 128, 0.45);
        }
      `}</style>
    </div>
  );
}
