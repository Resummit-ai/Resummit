"use client";

interface Project {
  name: string;
  techStack: string;
  bullets: string[];
}

export function ResumePreview({
  projects,
  user,
}: {
  projects: Project[];
  user: any;
}) {
  return (
    <div 
      className="bg-white text-black p-12 w-[210mm] min-h-[297mm] shadow-[0_0_50px_rgba(0,0,0,0.5)] origin-top scale-[0.65] lg:scale-[0.85] xl:scale-100"
      id="printable-resume"
    >
      {/* Header */}
      <header className="border-b-2 border-black pb-4 mb-8 text-center">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">
          {user?.name || "Professional Developer"}
        </h1>
        <div className="flex justify-center gap-4 text-sm font-medium">
          <span>{user?.email || "email@example.com"}</span>
          <span>•</span>
          <span>github.com/{user?.name?.toLowerCase().replace(/\s/g, "") || "profile"}</span>
        </div>
      </header>

      {/* Projects Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold border-b border-black mb-4 pb-1 uppercase tracking-wider">
          Technical Projects
        </h2>
        
        <div className="space-y-6">
          {projects.map((project, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-bold">
                  {project.name}
                </h3>
                <span className="text-sm font-semibold italic text-neutral-600">
                  {project.techStack}
                </span>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {project.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="text-[11pt] leading-relaxed text-gray-800">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section (Derived/Static for MVP) */}
      <section>
        <h2 className="text-xl font-bold border-b border-black mb-4 pb-1 uppercase tracking-wider">
          Skills & Technologies
        </h2>
        <div className="text-[11pt] leading-relaxed">
          <p>
            <span className="font-bold">Languages & Frameworks:</span>{" "}
            {Array.from(new Set(projects.map(p => p.techStack))).join(", ")}
          </p>
        </div>
      </section>

      {/* Footer / Meta */}
      <footer className="mt-auto pt-12 text-[9pt] text-gray-400 italic text-center no-print">
        Designed for high-impact ATS parsing. 1-page optimized.
      </footer>
    </div>
  );
}
