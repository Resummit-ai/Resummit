"use client";

import { useState } from "react";
import { Copy, Eye, FileText, Printer, RotateCcw, Save, Trash2 } from "lucide-react";
import { ResumePreview } from "./ResumePreview";

interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string;
  bullets: string[];
  repoUrl: string | null;
}

export function CVEditor({
  initialProjects,
  user,
}: {
  initialProjects: Project[];
  user: any;
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);

  const handleUpdateBullet = (projectId: string, index: number, value: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const newBullets = [...p.bullets];
        newBullets[index] = value;
        return { ...p, bullets: newBullets };
      }
      return p;
    }));
  };

  const handleRegenerate = async (projectId: string) => {
    setIsRegenerating(projectId);
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const res = await fetch("/api/sync/ai", {
        method: "POST",
        body: JSON.stringify({ projects: [project] }),
        headers: { "Content-Type": "application/json" },
      });
      
      const [newResult] = await res.json();
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, bullets: newResult.bullets } : p
      ));
    } catch (err) {
      alert("Failed to regenerate bullets. Please try again.");
    } finally {
      setIsRegenerating(null);
    }
  };

  const handleCopyText = () => {
    const text = projects.map(p => 
      `${p.name.toUpperCase()} | ${p.techStack}\n${p.bullets.map(b => `• ${b}`).join("\n")}`
    ).join("\n\n");
    
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard as plain text!");
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar / Editor */}
      <div className="w-full md:w-1/2 flex flex-col border-r border-neutral-800 h-full">
        <header className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Editor</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyText}
              className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 transition-colors"
              title="Copy as Text"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button 
              onClick={() => window.print()}
              className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors flex items-center gap-2 px-3 text-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
          {projects.map((project) => (
            <div key={project.id} className="group relative bg-neutral-900/30 rounded-xl border border-neutral-800 p-5 hover:border-neutral-700 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">{project.name}</h3>
                  <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{project.techStack}</p>
                </div>
                <button
                  onClick={() => handleRegenerate(project.id)}
                  disabled={isRegenerating === project.id}
                  className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-blue-400 transition-all disabled:opacity-50"
                  title="Regenerate with AI"
                >
                  <RotateCcw className={`w-4 h-4 ${isRegenerating === project.id ? "animate-spin" : ""}`} />
                </button>
              </div>

              <div className="space-y-3">
                {project.bullets.map((bullet, idx) => (
                  <div key={idx} className="relative">
                    <textarea
                      value={bullet}
                      onChange={(e) => handleUpdateBullet(project.id, idx, e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-300 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none resize-none transition-all"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="hidden md:flex w-1/2 flex-col bg-neutral-900/10 overflow-hidden">
        <header className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-neutral-500" />
            <span className="font-semibold text-neutral-500">ATS Preview</span>
          </div>
          <span className="text-xs font-mono text-neutral-600">A4 • 1 PAGE TARGET</span>
        </header>
        <div className="flex-1 overflow-y-auto p-12 flex justify-center bg-neutral-900/20">
          <ResumePreview projects={projects} user={user} />
        </div>
      </div>
    </div>
  );
}
