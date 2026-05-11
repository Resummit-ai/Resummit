"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Download, Plus, Trash2, RotateCcw, Link as LinkIcon,
  CheckCircle2, Activity, Eye, Sparkles, Target, X, Loader2,
  User, Briefcase, Code2, GraduationCap, Zap, AlertTriangle,
  ChevronDown, ChevronUp, Save, Wifi, WifiOff, ArrowUp, ArrowDown, ExternalLink,
  Rocket
} from "lucide-react";
import type { CVData, ProjectData, CVSkills, CVExperience, CVEducation, SaveStatus, EditorTab } from "@/lib/types";

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
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
  multiline?: boolean;
  rows?: number;
}) {
  if (multiline) {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-neutral-900/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none leading-relaxed ${className}`}
      />
    );
  }
  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-neutral-900/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all ${className}`}
    />
  );
}

function SkillTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-neutral-800/80 border border-white/10 text-neutral-300 px-3 py-1.5 rounded-full text-[11px] font-semibold group hover:border-blue-500/30 transition-all cursor-default">
      {label}
      <button
        onClick={onRemove}
        className="text-neutral-600 hover:text-red-400 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2 ml-1">
      {children}
    </label>
  );
}

// ─────────────────────────────────────────────
// ATS Score Panel
// ─────────────────────────────────────────────

function ATSPanel({ data, onClose }: { data: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 border border-white/10 p-12 rounded-[2.5rem] w-full max-w-2xl relative shadow-2xl overflow-hidden ring-1 ring-white/5">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-600/10 blur-[100px] rounded-full" />
        
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors p-2.5 hover:bg-white/5 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative">
          <div className="flex flex-col items-center mb-12">
            <div className="text-[11px] font-black uppercase tracking-[6px] text-blue-500 mb-6 bg-blue-500/10 px-4 py-1.5 rounded-full">
              Intelligence Audit
            </div>
            <div
              className={`text-[120px] leading-none font-black tracking-tighter font-outfit drop-shadow-[0_10px_40px_rgba(37,99,235,0.2)] ${
                data.score >= 70 ? "text-white" : data.score >= 50 ? "text-yellow-400" : "text-red-400"
              }`}
            >
              {data.score}
            </div>
            <div className="h-2 w-72 bg-white/5 rounded-full overflow-hidden mt-8 shadow-inner">
              <div
                className={`h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] ${
                  data.score >= 70 ? "bg-blue-500" : data.score >= 50 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${data.score}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {Object.entries(data.breakdown || {})
              .filter(([k]) => k !== "overall")
              .map(([key, val]) => (
                <div
                  key={key}
                  className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col items-center group hover:bg-blue-500/5 transition-colors"
                >
                  <div className="text-[9px] font-bold uppercase tracking-widest text-neutral-500 mb-2 group-hover:text-blue-400">
                    {key}
                  </div>
                  <div className="text-2xl font-bold text-white font-outfit">{val as number}%</div>
                </div>
              ))}
          </div>

          {data.topIssues?.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 ml-1">
                Critical Improvements
              </p>
              {data.topIssues.map((issue: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-neutral-300 bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 hover:border-blue-500/20 transition-all"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
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

function CVPreview({ cv, projects }: { cv: CVData; projects: ProjectData[] }) {
  const visibleProjects = projects.filter((p) => p.included !== false);
  const skills = cv.skills || { languages: [], frameworks: [], tools: [] };

  // Sanitize summary display (strip JSON strings if present)
  let displaySummary = cv.summary || "";
  if (displaySummary.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(displaySummary);
      displaySummary = parsed.summary || parsed.Summary || Object.values(parsed)[0] as string;
    } catch { /* ignore */ }
  }

  return (
    <div className="bg-white w-[794px] min-h-[1122px] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.2)] text-[#1a1a1b] font-inter flex flex-col overflow-hidden ring-1 ring-black/5">
      {/* ── Precision Header (Centered) ── */}
      <div className="pt-16 pb-10 px-16 text-center border-b-[3px] border-black">
        <h1 className="text-[42px] font-black tracking-[-1.5px] leading-tight text-black mb-3 font-outfit uppercase">
          {cv.name || "YOUR NAME"}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-[10px] font-black text-stone-400 uppercase tracking-[2px]">
          {cv.email && <span className="text-stone-800">{cv.email}</span>}
          {cv.phone && <><span className="text-stone-200">|</span><span className="text-stone-800">{cv.phone}</span></>}
          {cv.location && <><span className="text-stone-200">|</span><span>{cv.location}</span></>}
          {cv.github && <><span className="text-stone-200">|</span><span className="text-blue-600 font-bold underline decoration-blue-200 decoration-2 underline-offset-4">{cv.github.replace(/^https?:\/\//, '')}</span></>}
        </div>
      </div>

      {/* ── Balanced Body ── */}
      <div className="flex flex-1">
        {/* Left Column (Metadata) */}
        <div className="w-[260px] shrink-0 bg-[#fafafa] px-12 py-12 space-y-12">
          {/* Skills Audit */}
          {(skills.languages.length > 0 || skills.frameworks.length > 0 || skills.tools.length > 0) && (
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[3px] text-black mb-8 pb-1 border-b border-stone-200 font-outfit">
                Core Stack
              </h2>
              {skills.languages.length > 0 && (
                <div className="mb-8">
                  <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-2">Languages</p>
                  <p className="text-[12px] text-stone-800 leading-[1.6] font-medium">{skills.languages.join(", ")}</p>
                </div>
              )}
              {skills.frameworks.length > 0 && (
                <div className="mb-8">
                  <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-2">Frameworks</p>
                  <p className="text-[12px] text-stone-800 leading-[1.6] font-medium">{skills.frameworks.join(", ")}</p>
                </div>
              )}
              {skills.tools.length > 0 && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-2">Ecosystem</p>
                  <p className="text-[12px] text-stone-800 leading-[1.6] font-medium">{skills.tools.join(", ")}</p>
                </div>
              )}
            </div>
          )}

          {/* Academic Foundation */}
          {cv.education.length > 0 && (
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[3px] text-black mb-8 pb-1 border-b border-stone-200 font-outfit">
                Education
              </h2>
              {cv.education.map((edu, i) => (
                <div key={i} className="mb-8 last:mb-0">
                  <p className="text-[12px] font-black text-stone-900 leading-tight">{edu.school}</p>
                  <p className="text-[11px] text-stone-500 mt-1 font-medium italic">{edu.degree}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{edu.year}</span>
                    {edu.gpa && <span className="text-[9px] font-black text-blue-600/50 uppercase tracking-widest">GPA {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (Impact) */}
        <div className="flex-1 px-14 py-12 space-y-12 bg-white">
          {/* Summary */}
          {displaySummary && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-[3px] text-black mb-6 pb-1 border-b border-stone-200 font-outfit">
                Executive Brief
              </h2>
              <p className="text-[13px] text-stone-700 leading-[1.8] font-medium tracking-tight">
                {displaySummary}
              </p>
            </section>
          )}

          {/* Professional Experience */}
          {cv.experience.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-[3px] text-black mb-8 pb-1 border-b border-stone-200 font-outfit">
                Professional Trajectory
              </h2>
              {cv.experience.map((exp, i) => (
                <div key={i} className="mb-10 last:mb-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[16px] font-black text-black font-outfit tracking-tight">{exp.company}</h3>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest shrink-0 ml-4">{exp.period}</span>
                  </div>
                  <p className="text-[12px] font-bold text-blue-600 uppercase tracking-[2px] mb-4">{exp.title}</p>
                  <ul className="space-y-2.5">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex gap-4 text-[12px] text-stone-700 leading-[1.7] font-medium">
                        <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-stone-300 shrink-0 shadow-[0_0_5px_rgba(0,0,0,0.1)]" />
                        <span className="flex-1">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Key Projects */}
          {visibleProjects.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-[3px] text-black mb-8 pb-1 border-b border-stone-200 font-outfit">
                Selected Deep Work
              </h2>
              {visibleProjects.slice(0, 3).map((p, i) => (
                <div key={i} className="mb-10 last:mb-0">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-[16px] font-black text-black font-outfit tracking-tight">{p.name}</h3>
                    <span className="text-[9px] font-black text-blue-600/40 uppercase tracking-[3px] shrink-0 ml-4 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {p.techStack}
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {p.bullets.map((b, j) => (
                      <li key={j} className="flex gap-4 text-[12px] text-stone-700 leading-[1.7] font-medium">
                        <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-blue-500/30 shrink-0 ring-4 ring-blue-50" />
                        <span className="flex-1">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>

      {/* Audit Seal */}
      <div className="px-16 py-8 border-t border-stone-100 bg-[#fafafa] text-center mt-auto flex items-center justify-between">
        <p className="text-[8px] text-stone-300 uppercase font-black tracking-[4px]">Verified Semantic Intelligence Audit</p>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
           <span className="text-[8px] text-stone-500 uppercase font-black tracking-widest">Integrity Level: High</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main EditorClient
// ─────────────────────────────────────────────

export function EditorClient({
  initialCV,
  initialProjects,
}: {
  initialCV: CVData;
  initialProjects: ProjectData[];
}) {
  const [cv, setCV] = useState<CVData>(initialCV);
  const [projects, setProjects] = useState<ProjectData[]>(
    initialProjects.map((p) => ({ ...p, included: true }))
  );
  const [activeTab, setActiveTab] = useState<EditorTab>("profile");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [atsData, setAtsData] = useState<any>(null);
  const [atsError, setAtsError] = useState<string | null>(null);
  const [atsPanelOpen, setAtsPanelOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // AI action states
  const [regeneratingSummary, setRegeneratingSummary] = useState(false);
  const [suggestingSkills, setSuggestingSkills] = useState(false);
  const [rewritingBullet, setRewritingBullet] = useState<string | null>(null); // "projIdx-bulletIdx"

  // Expanded project card tracking
  const [expandedProject, setExpandedProject] = useState<number | null>(0);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirty = useRef(false);

  // ── Auto-save (debounced 2s) ──
  const saveCV = useCallback(async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/cv/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, projects, lastEditedBy: "USER" }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
    }
  }, [cv, projects]);

  useEffect(() => {
    if (!isDirty.current) {
      isDirty.current = true;
      return;
    }
    setSaveStatus("idle");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveCV(), 2000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [cv, projects, saveCV]);

  // ── Load ATS score on mount ──
  useEffect(() => {
    fetch("/api/cv/ats-score")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (d.error) setAtsError(d.error);
        else setAtsData(d);
      })
      .catch((e) => setAtsError(e.message));
  }, []);

  // ── CV update helpers ──
  const updateCV = (field: keyof CVData, val: any) =>
    setCV((prev) => ({ ...prev, [field]: val }));

  const updateSkills = (type: keyof CVSkills, val: string[]) =>
    setCV((prev) => ({ ...prev, skills: { ...prev.skills, [type]: val } }));

  const addSkill = (type: keyof CVSkills, raw: string) => {
    const val = raw.trim();
    if (!val) return;
    const current = cv.skills[type] || [];
    if (!current.includes(val)) updateSkills(type, [...current, val]);
  };

  const removeSkill = (type: keyof CVSkills, idx: number) => {
    const nu = [...(cv.skills[type] || [])];
    nu.splice(idx, 1);
    updateSkills(type, nu);
  };

  // ── Experience helpers ──
  const updateExp = (i: number, field: keyof CVExperience, val: any) => {
    const nu = [...cv.experience];
    (nu[i] as any)[field] = val;
    updateCV("experience", nu);
  };

  const updateExpBullet = (expIdx: number, bulletIdx: number, val: string) => {
    const nu = [...cv.experience];
    nu[expIdx] = { ...nu[expIdx], bullets: [...nu[expIdx].bullets] };
    nu[expIdx].bullets[bulletIdx] = val;
    updateCV("experience", nu);
  };

  const addExpBullet = (expIdx: number) => {
    const nu = [...cv.experience];
    nu[expIdx] = { ...nu[expIdx], bullets: [...nu[expIdx].bullets, ""] };
    updateCV("experience", nu);
  };

  const removeExpBullet = (expIdx: number, bulletIdx: number) => {
    const nu = [...cv.experience];
    nu[expIdx] = {
      ...nu[expIdx],
      bullets: nu[expIdx].bullets.filter((_, i) => i !== bulletIdx),
    };
    updateCV("experience", nu);
  };

  const addExperience = () => {
    updateCV("experience", [
      ...cv.experience,
      { company: "", title: "", period: "", bullets: [""] },
    ]);
  };

  const removeExperience = (i: number) => {
    updateCV("experience", cv.experience.filter((_, idx) => idx !== i));
  };

  // ── Education helpers ──
  const updateEdu = (i: number, field: keyof CVEducation, val: string) => {
    const nu = [...cv.education];
    (nu[i] as any)[field] = val;
    updateCV("education", nu);
  };

  const addEducation = () => {
    updateCV("education", [...cv.education, { school: "", degree: "", year: "", gpa: "" }]);
  };

  const removeEducation = (i: number) => {
    updateCV("education", cv.education.filter((_, idx) => idx !== i));
  };

  // ── Project helpers ──
  const updateProject = (i: number, field: keyof ProjectData, val: any) => {
    const nu = [...projects];
    (nu[i] as any)[field] = val;
    setProjects(nu);
  };

  const updateProjectBullet = (pIdx: number, bIdx: number, val: string) => {
    const nu = [...projects];
    nu[pIdx] = { ...nu[pIdx], bullets: [...nu[pIdx].bullets] };
    nu[pIdx].bullets[bIdx] = val;
    setProjects(nu);
  };

  // ── AI actions ──
  const handleRegenerateSummary = async () => {
    setRegeneratingSummary(true);
    try {
      const res = await fetch("/api/cv/regenerate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects, targetRole: cv.targetRole }),
      });
      const d = await res.json();
      if (d.summary) updateCV("summary", d.summary);
    } catch {
      /* silent */
    } finally {
      setRegeneratingSummary(false);
    }
  };

  const handleSuggestSkills = async () => {
    setSuggestingSkills(true);
    try {
      const res = await fetch("/api/cv/suggest-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projects,
          existing: [
            ...(cv.skills.languages || []),
            ...(cv.skills.frameworks || []),
            ...(cv.skills.tools || []),
          ],
        }),
      });
      const d = await res.json();
      if (d.skills) {
        const s = d.skills;
        updateCV("skills", {
          languages: [...new Set([...(cv.skills.languages || []), ...(s.languages || [])])],
          frameworks: [...new Set([...(cv.skills.frameworks || []), ...(s.frameworks || [])])],
          tools: [...new Set([...(cv.skills.tools || []), ...(s.tools || [])])],
        });
      }
    } catch {
      /* silent */
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
      const res = await fetch("/api/cv/regenerate-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet: current,
          projectName: p.name,
          tech: p.techStack,
          targetRole: cv.targetRole,
        }),
      });
      const d = await res.json();
      if (d.bullet) updateProjectBullet(pIdx, bIdx, d.bullet);
    } catch {
      /* silent */
    } finally {
      setRewritingBullet(null);
    }
  };

  const handleExportPDF = async () => {
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
      }
    } catch {
      alert("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  // ── Save status UI ──
  const SaveIndicator = () => {
    if (saveStatus === "idle") return null;
    return (
      <span
        className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-full transition-all ${
          saveStatus === "saving"
            ? "text-blue-400 bg-blue-500/10 border border-blue-500/20"
            : saveStatus === "saved"
            ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
            : "text-red-400 bg-red-500/10 border border-red-500/20"
        }`}
      >
        {saveStatus === "saving" && <Loader2 className="w-3 h-3 animate-spin" />}
        {saveStatus === "saved" && <CheckCircle2 className="w-3 h-3" />}
        {saveStatus === "error" && <AlertTriangle className="w-3 h-3" />}
        {saveStatus === "saving" ? "Syncing Engine" : saveStatus === "saved" ? "Database Ready" : "Sync Failure"}
      </span>
    );
  };

  const tabs: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "skills", label: "Mastery", icon: <Activity className="w-4 h-4" /> },
    { id: "experience", label: "Trajectory", icon: <Briefcase className="w-4 h-4" /> },
    { id: "projects", label: "Deep Work", icon: <Code2 className="w-4 h-4" /> },
  ];

  // ─────────────────────────────────────────────
  // Tab: Profile
  // ─────────────────────────────────────────────
  const renderProfile = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <SectionLabel>Public Identity</SectionLabel>
          <InlineEdit value={cv.name} onChange={(v) => updateCV("name", v)} placeholder="Full Name" />
        </div>
        <div className="col-span-1">
          <SectionLabel>High-Signal Role</SectionLabel>
          <InlineEdit
            value={cv.targetRole}
            onChange={(v) => updateCV("targetRole", v)}
            placeholder="e.g. Senior Backend Engineer"
          />
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div>
            <SectionLabel>Email Endpoint</SectionLabel>
            <InlineEdit value={cv.email} onChange={(v) => updateCV("email", v)} placeholder="professional@email.com" />
          </div>
          <div>
            <SectionLabel>Direct Contact</SectionLabel>
            <InlineEdit value={cv.phone} onChange={(v) => updateCV("phone", v)} placeholder="+1 (555) 000 000" />
          </div>
        </div>
        <div className="col-span-2">
          <SectionLabel>Global Location</SectionLabel>
          <InlineEdit value={cv.location} onChange={(v) => updateCV("location", v)} placeholder="San Francisco, CA" />
        </div>
        <div className="col-span-1">
          <SectionLabel>GitHub Source</SectionLabel>
          <InlineEdit value={cv.github} onChange={(v) => updateCV("github", v)} placeholder="github.com/handle" />
        </div>
        <div className="col-span-1">
          <SectionLabel>LinkedIn Node</SectionLabel>
          <InlineEdit
            value={cv.linkedin}
            onChange={(v) => updateCV("linkedin", v)}
            placeholder="linkedin.com/in/handle"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Executive Summary</SectionLabel>
          <button
            onClick={handleRegenerateSummary}
            disabled={regeneratingSummary}
            className="flex items-center gap-2 group text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-all bg-blue-500/5 hover:bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/10"
          >
            {regeneratingSummary ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            )}
            {regeneratingSummary ? "Analyzing Context" : "✦ Intelligence Brief"}
          </button>
        </div>
        <InlineEdit
          value={cv.summary}
          onChange={(v) => updateCV("summary", v)}
          placeholder="Two sentences of high-impact technical positioning."
          multiline
          rows={5}
        />
        <div className="mt-3 flex items-start gap-2 px-3 py-2 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
           <Zap className="w-3 h-3 text-yellow-500 mt-0.5 shrink-0" />
           <p className="text-[10px] text-yellow-200/60 leading-relaxed font-medium">Recruiters scan this for 7 seconds. Aim for exactly two high-density sentences.</p>
        </div>
      </div>

      {/* Education */}
      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Academic Foundation</SectionLabel>
          <button
            onClick={addEducation}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5"
          >
            <Plus className="w-3.5 h-3.5" /> Entry
          </button>
        </div>
        {cv.education.length === 0 && (
          <div className="text-center py-8 bg-white/5 border border-dashed border-white/10 rounded-2xl text-neutral-600 text-xs font-medium">
            No foundation data.{" "}
            <button onClick={addEducation} className="text-blue-500 hover:underline">
              Initialize Entry
            </button>
          </div>
        )}
        {cv.education.map((edu, i) => (
          <div key={i} className="group relative bg-[#121212] border border-white/5 rounded-2xl p-5 mb-4 hover:border-blue-500/20 transition-all">
            <button
              onClick={() => removeEducation(i)}
              className="absolute top-4 right-4 text-neutral-700 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-500/5"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <SectionLabel>Institution</SectionLabel>
                <InlineEdit value={edu.school} onChange={(v) => updateEdu(i, "school", v)} placeholder="University Name" />
              </div>
              <div className="col-span-1">
                <SectionLabel>Degree / Certification</SectionLabel>
                <InlineEdit value={edu.degree} onChange={(v) => updateEdu(i, "degree", v)} placeholder="B.Sc. in Engineering" />
              </div>
              <div className="col-span-1 grid grid-cols-2 gap-2">
                <div>
                   <SectionLabel>Completion</SectionLabel>
                   <InlineEdit value={edu.year} onChange={(v) => updateEdu(i, "year", v)} placeholder="2024" />
                </div>
                <div>
                   <SectionLabel>GPA</SectionLabel>
                   <InlineEdit value={edu.gpa || ""} onChange={(v) => updateEdu(i, "gpa", v)} placeholder="4.0" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────
  // Tab: Mastery (Skills)
  // ─────────────────────────────────────────────
  const renderSkills = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6">
        <div className="max-w-[180px]">
           <h3 className="text-xs font-bold text-white mb-1">Intelligence Audit</h3>
           <p className="text-[10px] text-blue-200/50 leading-relaxed font-medium">Let AI analyze your project source code to extract high-signal skills.</p>
        </div>
        <button
          onClick={handleSuggestSkills}
          disabled={suggestingSkills}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95"
        >
          {suggestingSkills ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {suggestingSkills ? "Extracting" : "✦ Sync Knowledge"}
        </button>
      </div>

      {(["languages", "frameworks", "tools"] as (keyof CVSkills)[]).map((type) => (
        <div key={type} className="group">
          <SectionLabel>{type}</SectionLabel>
          <div className="flex flex-wrap gap-2.5 mb-3 min-h-[50px] p-4 bg-neutral-900/60 border border-white/5 rounded-[1.25rem] group-focus-within:border-blue-500/30 transition-all shadow-inner">
            {(cv.skills[type] || []).map((s, i) => (
              <SkillTag key={i} label={s} onRemove={() => removeSkill(type, i)} />
            ))}
            {(cv.skills[type] || []).length === 0 && (
              <span className="text-neutral-700 text-xs italic font-medium pt-1">No data points indexed...</span>
            )}
          </div>
          <div className="relative">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addSkill(type, e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
              placeholder={`Add ${type} (comma separated)...`}
              className="w-full bg-transparent border-b border-white/5 px-2 py-3 text-xs text-neutral-400 placeholder:text-neutral-700 outline-none focus:border-blue-500/50 transition-all font-medium"
            />
            <div className="absolute right-2 top-3 text-[9px] font-bold text-neutral-700 pointer-events-none uppercase tracking-tighter">Enter to Index</div>
          </div>
        </div>
      ))}
    </div>
  );

  // ─────────────────────────────────────────────
  // Tab: Trajectory (Experience)
  // ─────────────────────────────────────────────
  const renderExperience = () => (
    <div className="space-y-6">
      {cv.experience.length === 0 && (
        <div className="text-center py-16 bg-[#111] border border-dashed border-white/5 rounded-[2rem] shadow-inner">
          <Briefcase className="w-10 h-10 text-neutral-800 mx-auto mb-4 stroke-[1.5]" />
          <p className="text-neutral-600 text-sm font-bold mb-4 uppercase tracking-[2px]">Empty Trajectory</p>
          <button
            onClick={addExperience}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase text-neutral-400 hover:text-white transition-all border border-white/5"
          >
            Create First Node
          </button>
        </div>
      )}

      {cv.experience.map((exp, i) => (
        <div key={i} className="bg-[#121212] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-blue-500/20 transition-all shadow-lg">
          <div className="px-6 py-4 flex items-center justify-between bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-colors border-b border-white/5">
            <div className="flex-1 min-w-0 mr-3">
              <p className="text-sm font-bold text-white truncate font-outfit">{exp.company || "Project Node"}</p>
              <div className="flex items-center gap-2 mt-0.5">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#444] group-hover:text-blue-500 transition-colors uppercase truncate">{exp.title || "Position"}</p>
                 <span className="w-1 h-1 rounded-full bg-neutral-800" />
                 <p className="text-[10px] font-bold text-neutral-600 truncate">{exp.period || "00/0000 – 00/0000"}</p>
              </div>
            </div>
            <button onClick={() => removeExperience(i)} className="p-2 text-neutral-700 hover:text-red-400 hover:bg-red-500/5 transition-all rounded-xl">
               <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <SectionLabel>Organization</SectionLabel>
                <InlineEdit value={exp.company} onChange={(v) => updateExp(i, "company", v)} placeholder="Company Name" />
              </div>
              <div>
                <SectionLabel>Temporal Period</SectionLabel>
                <InlineEdit value={exp.period} onChange={(v) => updateExp(i, "period", v)} placeholder="e.g. June 2021 – Present" />
              </div>
              <div className="col-span-2">
                <SectionLabel>Executive Title</SectionLabel>
                <InlineEdit value={exp.title} onChange={(v) => updateExp(i, "title", v)} placeholder="Software Engineer / Technical Lead" />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <SectionLabel>High-Impact Outcomes</SectionLabel>
                <button
                  onClick={() => addExpBullet(i)}
                  className="text-[9px] font-black uppercase tracking-widest text-neutral-600 hover:text-white flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-lg transition-all"
                >
                  <Plus className="w-3 h-3" /> Outcome
                </button>
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
                      className="flex-1 text-[13px] !bg-white/[0.02] hover:!bg-white/[0.04]"
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
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full h-20 flex flex-col items-center justify-center gap-1 border border-dashed border-white/5 hover:border-blue-500/30 bg-white/[0.01] hover:bg-blue-500/5 rounded-[2rem] text-neutral-600 hover:text-blue-400 transition-all duration-300 group"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[2px]">Append Career Node</span>
      </button>
    </div>
  );

  // ─────────────────────────────────────────────
  // Tab: Deep Work (Projects)
  // ─────────────────────────────────────────────
  const renderProjects = () => (
    <div className="space-y-6">
      {projects.map((p, pIdx) => (
        <div
          key={p.id}
          className={`border rounded-[2rem] overflow-hidden transition-all duration-500 shadow-xl ${
            p.included === false
              ? "border-white/5 bg-black/40 opacity-40 hover:opacity-70 scale-[0.98]"
              : "border-white/5 bg-[#121212] hover:border-blue-500/30"
          }`}
        >
          {/* Card header */}
          <div
            className="px-7 py-5 flex items-center justify-between cursor-pointer group/header"
            onClick={() => setExpandedProject(expandedProject === pIdx ? null : pIdx)}
          >
            <div className="flex-1 min-w-0 mr-4">
              <div className="flex items-center gap-3">
                <p className="text-[15px] font-bold text-white truncate font-outfit tracking-tight">{p.name}</p>
                {p.included === false && (
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-lg border border-white/5">
                    Isolated
                  </span>
                )}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-neutral-600 mt-1">{p.techStack}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateProject(pIdx, "included", p.included === false ? true : false);
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all border ${
                  p.included === false
                    ? "text-neutral-700 bg-white/5 border-white/5 hover:border-white/10"
                    : "text-blue-400 bg-blue-500/5 border-blue-500/10 hover:bg-blue-500/10"
                }`}
                title={p.included === false ? "Restore to CV" : "Isolate from CV"}
              >
                <Eye className="w-5 h-5" />
              </button>
              <div className={`w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 transition-transform ${expandedProject === pIdx ? 'rotate-180 text-white' : 'text-neutral-600'}`}>
                 <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Expanded content */}
          {expandedProject === pIdx && (
            <div className="p-7 space-y-6 border-t border-white/5 animate-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <SectionLabel>Label</SectionLabel>
                  <InlineEdit
                    value={p.name}
                    onChange={(v) => updateProject(pIdx, "name", v)}
                    placeholder="Project Name"
                  />
                </div>
                <div>
                  <SectionLabel>Tech Substrate</SectionLabel>
                  <InlineEdit
                    value={p.techStack}
                    onChange={(v) => updateProject(pIdx, "techStack", v)}
                    placeholder="Languages / Frameworks"
                  />
                </div>
              </div>

              <div>
                <SectionLabel>High-Impact Bullets</SectionLabel>
                <div className="space-y-3">
                  {p.bullets.map((b, bIdx) => {
                    const key = `${pIdx}-${bIdx}`;
                    return (
                      <div key={bIdx} className="flex gap-4 items-start group/proj-bullet">
                        <div className="mt-4 w-1.5 h-1.5 rounded-full bg-neutral-800 shrink-0 group-hover/proj-bullet:bg-blue-500 transition-all shadow-[0_0_8px_rgba(37,99,235,0)] group-hover/proj-bullet:shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                        <div className="flex-1 relative">
                          <InlineEdit
                            value={b}
                            onChange={(v) => updateProjectBullet(pIdx, bIdx, v)}
                            placeholder="Descriptive bullet point."
                            multiline
                            rows={2}
                            className="text-[13px] pr-12 !bg-[#0a0a0a]"
                          />
                          <button
                            onClick={() => handleRewriteBullet(pIdx, bIdx, b)}
                            disabled={rewritingBullet === key}
                            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-blue-500/20 text-neutral-600 hover:text-blue-400 border border-white/5 hover:border-blue-500/20 transition-all disabled:opacity-50"
                            title="Semantic Rewrite"
                          >
                            {rewritingBullet === key ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Zap className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            const nu = [...projects];
                            nu[pIdx] = { ...nu[pIdx], bullets: p.bullets.filter((_, i) => i !== bIdx) };
                            setProjects(nu);
                          }}
                          className="mt-3 text-neutral-800 hover:text-red-400 transition-all opacity-0 group-hover/proj-bullet:opacity-100 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => {
                    const nu = [...projects];
                    nu[pIdx] = { ...nu[pIdx], bullets: [...p.bullets, ""] };
                    setProjects(nu);
                  }}
                  className="mt-4 text-[9px] font-black uppercase tracking-widest text-neutral-700 hover:text-white flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Logic Node
                </button>
              </div>

              {p.repoUrl && (
                <div className="pt-4 border-t border-white/5">
                   <a
                     href={p.repoUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-all"
                   >
                     <ExternalLink className="w-3.5 h-3.5" /> Raw Source Code
                   </a>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#050505] text-[#e5e5e5] overflow-hidden font-inter selection:bg-blue-500/30">
      {/* ── Left Sidebar Header ── */}
      <div className="w-[480px] flex-shrink-0 flex flex-col border-r border-white/[0.03] bg-[#0a0a0a] shadow-[10px_0_40px_rgba(0,0,0,0.4)] z-20">
        {/* Superior Header */}
        <header className="px-8 py-7 flex items-center justify-between border-b border-white/[0.03] relative bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-blue-600/5 blur-[80px] pointer-events-none" />
          <div className="flex items-center gap-4 relative">
             <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transform rotate-3">
               <Rocket className="w-6 h-6 text-white" />
             </div>
            <div className="flex flex-col">
               <span className="font-black text-xl tracking-tighter font-outfit uppercase">
                 SCLADE<span className="text-blue-500">AI</span>
               </span>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[3px] text-neutral-600 leading-none">Core Engine / V2</span>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-3 relative">
            <SaveIndicator />
          </div>
        </header>

        {/* Global Action Bar */}
        <div className="px-8 py-5 border-b border-white/[0.03] flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
               {atsError ? (
                 <div className="px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> Audit Error
                 </div>
               ) : atsData ? (
                 <button
                   onClick={() => setAtsPanelOpen(true)}
                   className={`px-4 py-2 rounded-2xl border transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest ${
                     atsData.score >= 70
                       ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                       : "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                   }`}
                 >
                   <Target className="w-3.5 h-3.5" />
                   {atsData.score} Score
                 </button>
               ) : (
                 <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5 text-neutral-600 text-[10px] font-black uppercase animate-pulse flex items-center gap-2.5">
                   <Loader2 className="w-3.5 h-3.5 animate-spin" /> Scoring...
                 </div>
               )}
            </div>
            
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2.5 bg-white text-black hover:bg-neutral-200 transition-all px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(255,255,255,0.15)] disabled:opacity-50 active:translate-y-0.5"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Export Audit
            </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-black px-4 py-2 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2.5 py-4 text-[10px] font-bold uppercase tracking-[2px] transition-all rounded-2xl border ${
                activeTab === tab.id
                  ? "bg-blue-600/10 border-blue-600/30 text-blue-400 shadow-inner"
                  : "bg-transparent border-transparent text-neutral-600 hover:text-neutral-400 hover:bg-white/5"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Context Window */}
        <div className="flex-1 overflow-y-auto px-8 py-8 pb-32 custom-scrollbar">
          {activeTab === "profile" && renderProfile()}
          {activeTab === "skills" && renderSkills()}
          {activeTab === "experience" && renderExperience()}
          {activeTab === "projects" && renderProjects()}
        </div>
      </div>

      {/* ── Right Panel: Precision CV Preview ── */}
      <div className="flex-1 bg-[#1a1a1a] overflow-y-auto flex px-12 py-16 justify-center items-start custom-scrollbar perspective-[1000px]">
        <div className="relative group transition-all duration-700 hover:rotate-y-1">
          <div className="absolute inset-0 bg-blue-600/5 blur-[120px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CVPreview cv={cv} projects={projects} />
        </div>
      </div>

      {/* Audit Modal Reveal */}
      {atsPanelOpen && atsData && (
        <ATSPanel data={atsData} onClose={() => setAtsPanelOpen(false)} />
      )}
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
}
