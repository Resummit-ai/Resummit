"use client";

import { CVData, CVExperience, CVEducation, CVSkills, ProjectData } from "@/lib/types";
import { normalizeAndDedupeSkills, formatLinkedIn, formatGitHub } from "@/lib/skills-data";
import { AITextTransform } from "./AITextTransform";

interface ResumePreviewProps {
  data: CVData;
  projects?: ProjectData[];
  template?: "minimal" | "formal";
  mode?: "non-specialized" | "specialized";
  generatingStates?: {
    summary?: boolean;
    skills?: boolean;
    experienceIndex?: number | null;
    projectIndex?: number | null;
    rewritingBullet?: string | null;
    isTailoring?: boolean;
  };
  suggestions?: {
    summary?: string | null;
    projectBullets?: Record<string, string>;
  };
  onAcceptSuggestion?: (field: string, value: any, index?: number, bulletIndex?: number) => void;
  onDiscardSuggestion?: (field: string, index?: number, bulletIndex?: number) => void;
  onRevertField?: (field: string, value: any, index?: number, bulletIndex?: number) => void;
}

export function ResumePreview({
  data,
  projects = [],
  template = "formal",
  mode = "non-specialized",
  generatingStates,
  suggestions,
  onAcceptSuggestion,
  onDiscardSuggestion,
  onRevertField,
}: ResumePreviewProps) {
  if (template === "minimal") {
    return (
      <MinimalTemplate 
        data={data} 
        projects={projects} 
        generatingStates={generatingStates} 
        suggestions={suggestions}
        onAcceptSuggestion={onAcceptSuggestion}
        onDiscardSuggestion={onDiscardSuggestion}
        onRevertField={onRevertField} 
      />
    );
  }
  return (
    <FormalTemplate 
      data={data} 
      projects={projects} 
      mode={mode} 
      generatingStates={generatingStates} 
      suggestions={suggestions}
      onAcceptSuggestion={onAcceptSuggestion}
      onDiscardSuggestion={onDiscardSuggestion}
      onRevertField={onRevertField} 
    />
  );
}

function parseAchievementString(str: string) {
  if (!str) return { title: "", date: null, url: null };
  // Handle new structured JSON format from the sidebar editor
  const trimmed = str.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      return {
        title: (parsed.title || "").replace(/\s*\[Link\]\s*$/i, "").trim(),
        date: (parsed.date || "").replace(/\s*\[Link\]\s*$/i, "").trim() || null,
        url: parsed.url ? parsed.url.replace(/\s*\[Link\]\s*$/i, "").trim() : null,
      };
    } catch {
      // JSON is malformed — try extracting fields manually with regex
      const titleM = trimmed.match(/["']title["']\s*:\s*["']([^"']+)["']/);
      const dateM  = trimmed.match(/["']date["']\s*:\s*["']([^"']+)["']/);
      const urlM   = trimmed.match(/["']url["']\s*:\s*["']([^"']+)["']/);
      if (titleM || dateM) {
        return {
          title: titleM?.[1]?.trim() || "",
          date: dateM?.[1]?.replace(/\s*\[Link\]\s*$/i, "").trim() || null,
          url: urlM?.[1]?.replace(/\s*\[Link\]\s*$/i, "").trim() || null,
        };
      }
    }
  }
  // Legacy regex fallback for plain-text achievements
  const urlRegex = /(https?:\/\/[^\s]+|(?:credly\.com|coursera\.org|github\.com|linkedin\.com|devpost\.com)\S+)/gi;
  let url: string | null = null;
  const urlMatch = str.match(urlRegex);
  if (urlMatch) url = urlMatch[0];
  let tempStr = str.replace(urlRegex, "").trim();
  // Try parenthesised date first: (Dec 2025) or (2025)
  const parenDateRegex = /\(([^)]*(?:\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b)[^)]*)\)/i;
  let date: string | null = null;
  const parenMatch = tempStr.match(parenDateRegex);
  if (parenMatch) {
    date = parenMatch[1].trim();
    tempStr = tempStr.replace(parenDateRegex, "").trim();
  } else {
    // Bare month-year: "Dec 2025" or just "2025" at end of string
    const bareMonthYear = tempStr.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(20\d{2})\b/i);
    const bareYear = tempStr.match(/\b(20\d{2})\b/);
    if (bareMonthYear) {
      date = `${bareMonthYear[1]} ${bareMonthYear[2]}`;
      tempStr = tempStr.replace(bareMonthYear[0], "").trim();
    } else if (bareYear) {
      date = bareYear[1];
    }
  }
  let title = tempStr.replace(/\s*[-–—:]\s*$/, "").trim();
  return { title, date, url };
}

function parseAndRenderLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+|(?:credly\.com|coursera\.org|github\.com|linkedin\.com|devpost\.com|credly\.com\/badges)\/[^\s]+)/gi;
  const parts = text.split(urlRegex);
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      let cleanLabel = part.replace(/^https?:\/\/(www\.)?/, "");
      if (cleanLabel.length > 40) {
        cleanLabel = cleanLabel.substring(0, 37) + "...";
      }
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "underline", color: "#1a0dab" }}
          className="hover:text-blue-600 transition-colors"
        >
          {cleanLabel}
        </a>
      );
    }
    return part;
  });
}

function FormalTemplate({
  data,
  projects,
  mode,
  generatingStates,
  suggestions,
  onAcceptSuggestion,
  onDiscardSuggestion,
  onRevertField,
}: {
  data: CVData;
  projects: ProjectData[];
  mode: "non-specialized" | "specialized";
  generatingStates?: ResumePreviewProps["generatingStates"];
  suggestions?: ResumePreviewProps["suggestions"];
  onAcceptSuggestion?: ResumePreviewProps["onAcceptSuggestion"];
  onDiscardSuggestion?: ResumePreviewProps["onDiscardSuggestion"];
  onRevertField?: ResumePreviewProps["onRevertField"];
}) {
  const displaySkills = normalizeAndDedupeSkills(data.skills);

  // Parse summary if it was accidentally stored as JSON
  let displaySummary = "";
  if (typeof data.summary === "string") {
    displaySummary = data.summary;
  } else if (data.summary && typeof data.summary === "object") {
    displaySummary = (data.summary as any).summary || (data.summary as any).Summary || JSON.stringify(data.summary);
  }

  if (displaySummary && typeof displaySummary === "string" && displaySummary.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(displaySummary);
      displaySummary =
        parsed.summary || parsed.Summary || (Object.values(parsed)[0] as string);
    } catch {
      /* ignore */
    }
  }

  // Filter out placeholder bullets from experience
  const cleanExperience = data.experience.slice(0, 3).map((exp) => ({
    ...exp,
    bullets: (exp.bullets || [])
      .filter(
        (b) =>
          b.trim() &&
          b !== "Achieved X by implementing Y resulting in Z% growth."
      )
      .slice(0, 3),
  }));

  // Only show included projects, max 3, max 2 highlights each
  const includedProjects = projects
    .filter((p) => p.included !== false)
    .slice(0, 3)
    .map((p) => ({
      ...p,
      highlights: (p.highlights || []).filter((h) => h.trim()).slice(0, 2),
    }));

  // Calculate content density score to dynamically scale styling for single-page enforcement
  const expCount = cleanExperience.length;
  const expBullets = cleanExperience.reduce((sum, e) => sum + (e.bullets?.length || 0), 0);
  const projCount = includedProjects.length;
  const projBullets = includedProjects.reduce((sum, p) => sum + (p.highlights?.length || 0), 0);
  const eduCount = data.education.length;
  const achCount = (data.achievements || []).filter((a) => a.trim()).slice(0, 4).length;
  const summaryLength = displaySummary ? displaySummary.length : 0;

  const score = expCount * 3 + expBullets * 1 + projCount * 3 + projBullets * 1 + eduCount * 2 + achCount * 1.5 + (summaryLength > 200 ? Math.ceil(summaryLength / 80) : 2);

  // Dynamic style scaling variables
  let fontSizeBody = "8.5pt";
  let fontSizeSecTitle = "9.5pt";
  let fontSizeSummary = "9pt";
  let fontSizeEntryHeader = "9.5pt";
  let fontSizeSub = "9pt";
  let fontSizePeriod = "8.5pt";
  let fontSizeName = "22pt";
  
  let lineHeightBody = 1.4;
  let lineHeightSummary = 1.4;
  let lineHeightSkills = 1.5;
  
  let paddingPage = "10.5mm 12.3mm";
  let marginHeader = "8px";
  let marginSection = "10px";
  let sectionTitlePaddingTop = "3px";
  let sectionTitleMarginBottom = "5px";
  let entryGap = "8px";
  let bulletMarginBottom = "2px";
  let skillLineMarginBottom = "1px";

  if (score > 62) {
    // Super Dense
    fontSizeBody = "7.2pt";
    fontSizeSecTitle = "8pt";
    fontSizeSummary = "7.6pt";
    fontSizeEntryHeader = "8pt";
    fontSizeSub = "7.6pt";
    fontSizePeriod = "7.2pt";
    fontSizeName = "16.5pt";
    
    lineHeightBody = 1.1;
    lineHeightSummary = 1.1;
    lineHeightSkills = 1.15;
    
    paddingPage = "5mm 8.5mm";
    marginHeader = "3px";
    marginSection = "3px";
    sectionTitlePaddingTop = "1px";
    sectionTitleMarginBottom = "1.5px";
    entryGap = "2px";
    bulletMarginBottom = "0.2px";
    skillLineMarginBottom = "0.2px";
  } else if (score > 52) {
    // Very Dense
    fontSizeBody = "7.6pt";
    fontSizeSecTitle = "8.5pt";
    fontSizeSummary = "8pt";
    fontSizeEntryHeader = "8.5pt";
    fontSizeSub = "8pt";
    fontSizePeriod = "7.6pt";
    fontSizeName = "18pt";
    
    lineHeightBody = 1.2;
    lineHeightSummary = 1.2;
    lineHeightSkills = 1.25;
    
    paddingPage = "6.5mm 9.5mm";
    marginHeader = "4px";
    marginSection = "4px";
    sectionTitlePaddingTop = "1.5px";
    sectionTitleMarginBottom = "2px";
    entryGap = "3px";
    bulletMarginBottom = "0.5px";
    skillLineMarginBottom = "0.5px";
  } else if (score > 42) {
    // Dense
    fontSizeBody = "8pt";
    fontSizeSecTitle = "9pt";
    fontSizeSummary = "8.5pt";
    fontSizeEntryHeader = "9pt";
    fontSizeSub = "8.5pt";
    fontSizePeriod = "8pt";
    fontSizeName = "20pt";
    
    lineHeightBody = 1.3;
    lineHeightSummary = 1.3;
    lineHeightSkills = 1.35;
    
    paddingPage = "8.5mm 11mm";
    marginHeader = "6px";
    marginSection = "6.5px";
    sectionTitlePaddingTop = "2px";
    sectionTitleMarginBottom = "3px";
    entryGap = "5px";
    bulletMarginBottom = "1px";
    skillLineMarginBottom = "1px";
  }

  return (
    <div
      className="bg-white text-black w-[210mm] min-h-[297mm] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative"
      id="printable-resume"
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        padding: paddingPage,
        boxSizing: "border-box",
      }}
    >
      {/* ── Header ── */}
      <header style={{ textAlign: "center", marginBottom: marginHeader }}>
        <div
          style={{
            fontSize: fontSizeName,
            fontWeight: "bold",
            color: "#1a202c",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {data.name || "Your Name"}
        </div>
        <div
          style={{
            fontSize: score > 48 ? "7.5pt" : "8pt",
            color: "#4a5568",
            marginTop: "3px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0 8px",
            lineHeight: 1.4,
          }}
        >
          {data.location && <span>{data.location}</span>}
          {data.email && (
            <span>
              •{" "}
              <a
                href={`mailto:${data.email}`}
                style={{ textDecoration: "underline", color: "#4a5568" }}
                className="hover:text-blue-600 transition-colors"
              >
                {data.email}
              </a>
            </span>
          )}
          {data.phone && <span>• {data.phone}</span>}
          {data.github && (
            <span>
              •{" "}
              <a
                href={data.github.startsWith("http") ? data.github : `https://${data.github}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline", color: "#4a5568" }}
                className="hover:text-blue-600 transition-colors"
              >
                {formatGitHub(data.github)}
              </a>
            </span>
          )}
          {data.linkedin && (
            <span>
              •{" "}
              <a
                href={data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline", color: "#4a5568" }}
                className="hover:text-blue-600 transition-colors"
              >
                {formatLinkedIn(data.linkedin)}
              </a>
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {displaySummary && (
        <div className={`relative overflow-hidden ${generatingStates?.summary || generatingStates?.isTailoring ? 'ai-generating-container' : ''}`}>
          {(generatingStates?.summary || generatingStates?.isTailoring) && <div className="ai-generating-overlay no-print" />}
          <Section 
            title={mode === "specialized" ? "Technical Summary" : "Professional Summary"}
            marginSection={marginSection}
            fontSizeSecTitle={fontSizeSecTitle}
            sectionTitlePaddingTop={sectionTitlePaddingTop}
            sectionTitleMarginBottom={sectionTitleMarginBottom}
          >
            <p 
              style={{ fontSize: fontSizeSummary, lineHeight: lineHeightSummary, color: "#2d3748" }}
            >
              <AITextTransform 
                text={displaySummary} 
                suggestion={suggestions?.summary || undefined}
                isGenerating={generatingStates?.summary || generatingStates?.isTailoring} 
                onAccept={(val) => onAcceptSuggestion?.("summary", val)}
                onDiscard={() => onDiscardSuggestion?.("summary")}
                onRevert={(oldText) => onRevertField?.("summary", oldText)}
              />
            </p>
          </Section>
        </div>
      )}

      {/* Expert-Level Skills */}
      {((displaySkills.languages || []).length > 0 || (displaySkills.frameworks || []).length > 0 || (displaySkills.tools || []).length > 0) && (
        <div className={`relative overflow-hidden ${generatingStates?.skills || generatingStates?.isTailoring ? 'ai-generating-container' : ''}`}>
          {(generatingStates?.skills || generatingStates?.isTailoring) && <div className="ai-generating-overlay no-print" />}
          <Section 
            title={mode === "specialized" ? "Technical Skills" : "Expert-Level Skills"}
            marginSection={marginSection}
            fontSizeSecTitle={fontSizeSecTitle}
            sectionTitlePaddingTop={sectionTitlePaddingTop}
            sectionTitleMarginBottom={sectionTitleMarginBottom}
          >
            <div style={{ fontSize: fontSizeBody, lineHeight: lineHeightSkills }}>
              {(displaySkills.languages || []).length > 0 && (
                <div style={{ display: "flex", flexDirection: "row", marginBottom: skillLineMarginBottom }}>
                  <span style={{ fontWeight: "bold", color: "#1a202c", marginRight: "4px" }}>Languages:</span>
                  <span style={{ color: "#2d3748" }}>
                    <AITextTransform 
                      text={displaySkills.languages.join(", ")} 
                      isGenerating={generatingStates?.skills || generatingStates?.isTailoring} 
                      onRevert={(oldVal) => onRevertField?.("skills", { ...data.skills, languages: oldVal.split(",").map((s: string) => s.trim()) })}
                    />
                  </span>
                </div>
              )}
              {(displaySkills.frameworks || []).length > 0 && (
                <div style={{ display: "flex", flexDirection: "row", marginBottom: skillLineMarginBottom }}>
                  <span style={{ fontWeight: "bold", color: "#1a202c", marginRight: "4px" }}>Frameworks:</span>
                  <span style={{ color: "#2d3748" }}>
                    <AITextTransform 
                      text={displaySkills.frameworks.join(", ")} 
                      isGenerating={generatingStates?.skills || generatingStates?.isTailoring} 
                      onRevert={(oldVal) => onRevertField?.("skills", { ...data.skills, frameworks: oldVal.split(",").map((s: string) => s.trim()) })}
                    />
                  </span>
                </div>
              )}
              {(displaySkills.tools || []).length > 0 && (
                <div style={{ display: "flex", flexDirection: "row", marginBottom: skillLineMarginBottom }}>
                  <span style={{ fontWeight: "bold", color: "#1a202c", marginRight: "4px" }}>Tools &amp; Cloud:</span>
                  <span style={{ color: "#2d3748" }}>
                    <AITextTransform 
                      text={displaySkills.tools.join(", ")} 
                      isGenerating={generatingStates?.skills || generatingStates?.isTailoring} 
                      onRevert={(oldVal) => onRevertField?.("skills", { ...data.skills, tools: oldVal.split(",").map((s: string) => s.trim()) })}
                    />
                  </span>
                </div>
              )}
            </div>
          </Section>
        </div>
      )}

      {/* Professional Experience */}
      {cleanExperience.length > 0 && (
        <Section 
          title="Professional Experience"
          marginSection={marginSection}
          fontSizeSecTitle={fontSizeSecTitle}
          sectionTitlePaddingTop={sectionTitlePaddingTop}
          sectionTitleMarginBottom={sectionTitleMarginBottom}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: entryGap }}>
            {cleanExperience.map((exp, idx) => {
              const isGenerating = generatingStates?.experienceIndex === idx || generatingStates?.isTailoring;
              return (
                <div key={idx} className={`relative overflow-hidden ${isGenerating ? 'ai-generating-container' : ''}`}>
                  {isGenerating && <div className="ai-generating-overlay no-print" />}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span 
                      style={{ fontSize: fontSizeEntryHeader, fontWeight: "bold", color: "#1a202c" }}
                    >
                      <AITextTransform 
                        text={exp.title} 
                        isGenerating={isGenerating} 
                        onRevert={(oldVal) => onRevertField?.("experience", { ...exp, title: oldVal }, idx)}
                      />
                    </span>
                    <span 
                      style={{ fontSize: fontSizePeriod, fontWeight: "bold", color: "#1a202c", whiteSpace: "nowrap", marginLeft: "8px" }}
                    >
                      <AITextTransform 
                        text={exp.period} 
                        isGenerating={isGenerating} 
                        onRevert={(oldVal) => onRevertField?.("experience", { ...exp, period: oldVal }, idx)}
                      />
                    </span>
                  </div>
                  <div 
                    style={{ fontSize: fontSizeSub, color: "#4a5568", marginBottom: score > 35 ? "1px" : "3px" }}
                  >
                    <AITextTransform 
                      text={exp.company} 
                      isGenerating={isGenerating} 
                      onRevert={(oldVal) => onRevertField?.("experience", { ...exp, company: oldVal }, idx)}
                    />
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul
                      style={{
                        margin: "2px 0 0 14px",
                        padding: 0,
                        listStyleType: "disc",
                      }}
                    >
                      {exp.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          style={{
                            fontSize: fontSizeBody,
                            lineHeight: lineHeightBody,
                            color: "#2d3748",
                            marginBottom: bulletMarginBottom,
                            wordBreak: "break-word",
                          }}
                        >
                          <AITextTransform 
                            text={bullet} 
                            isGenerating={isGenerating} 
                            onRevert={(oldBullet) => {
                              const nuBullets = [...exp.bullets];
                              nuBullets[bIdx] = oldBullet;
                              onRevertField?.("experience", { ...exp, bullets: nuBullets }, idx);
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Technical Projects */}
      {includedProjects.length > 0 && (
        <Section 
          title="Technical Projects"
          marginSection={marginSection}
          fontSizeSecTitle={fontSizeSecTitle}
          sectionTitlePaddingTop={sectionTitlePaddingTop}
          sectionTitleMarginBottom={sectionTitleMarginBottom}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: entryGap }}>
            {includedProjects.map((project, idx) => {
              const isGenerating = generatingStates?.projectIndex === idx || generatingStates?.isTailoring;
              return (
                <div key={idx} className={`relative overflow-hidden ${isGenerating ? 'ai-generating-container' : ''}`}>
                  {isGenerating && <div className="ai-generating-overlay no-print" />}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    {project.githubUrl || project.liveUrl ? (
                      <a
                        href={project.githubUrl || project.liveUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: fontSizeEntryHeader, fontWeight: "bold", textDecoration: "underline", color: "#1a202c" }}
                        className="hover:text-blue-600 transition-colors"
                      >
                        <AITextTransform 
                          text={project.title || "Untitled Project"} 
                          isGenerating={isGenerating} 
                          onRevert={(oldTitle) => onRevertField?.("projects", { ...project, title: oldTitle }, idx)}
                        />
                      </a>
                    ) : (
                      <span 
                        style={{ fontSize: fontSizeEntryHeader, fontWeight: "bold", color: "#1a202c" }}
                      >
                        <AITextTransform 
                          text={project.title || "Untitled Project"} 
                          isGenerating={isGenerating} 
                          onRevert={(oldTitle) => onRevertField?.("projects", { ...project, title: oldTitle }, idx)}
                        />
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: score > 48 ? "7.5pt" : "8pt",
                        fontStyle: "italic",
                        color: "#4a5568",
                        whiteSpace: "nowrap",
                        marginLeft: "8px",
                      }}
                    >
                      <AITextTransform 
                        text={Array.isArray(project.techStack)
                          ? project.techStack.slice(0, 4).join(", ")
                          : typeof project.techStack === "string"
                          ? project.techStack
                          : ""} 
                        isGenerating={isGenerating} 
                        onRevert={(oldStack) => onRevertField?.("projects", { ...project, techStack: oldStack.split(",").map((s: string) => s.trim()) }, idx)}
                      />
                    </span>
                  </div>
                  {project.description && (
                    <div
                      style={{
                        fontSize: fontSizeBody,
                        color: "#2d3748",
                        marginBottom: score > 35 ? "1px" : "3px",
                        marginTop: "2px",
                      }}
                    >
                      <AITextTransform 
                        text={project.description} 
                        isGenerating={isGenerating} 
                        onRevert={(oldDesc) => onRevertField?.("projects", { ...project, description: oldDesc }, idx)}
                      />
                    </div>
                  )}
                  {project.highlights.length > 0 && (
                    <ul
                      style={{
                        margin: "2px 0 0 14px",
                        padding: 0,
                        listStyleType: "disc",
                      }}
                    >
                      {project.highlights.map((bullet, bIdx) => {
                        const isBulletRewriting = generatingStates?.rewritingBullet === `${idx}-${bIdx}`;
                        const bulletKey = `${project.id}-${bIdx}`;
                        const bulletSuggestion = suggestions?.projectBullets?.[bulletKey];
                        return (
                          <li
                            key={bIdx}
                            style={{
                              fontSize: fontSizeBody,
                              lineHeight: lineHeightBody,
                              color: "#2d3748",
                              marginBottom: bulletMarginBottom,
                              wordBreak: "break-word",
                            }}
                          >
                            <AITextTransform 
                              text={bullet} 
                              suggestion={bulletSuggestion}
                              isGenerating={isGenerating || isBulletRewriting} 
                              onAccept={(val) => onAcceptSuggestion?.("project-bullet", val, idx, bIdx)}
                              onDiscard={() => onDiscardSuggestion?.("project-bullet", idx, bIdx)}
                              onRevert={(oldBullet) => {
                                const nuHighlights = [...project.highlights];
                                nuHighlights[bIdx] = oldBullet;
                                onRevertField?.("project-bullet", oldBullet, idx, bIdx);
                              }}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className={`relative overflow-hidden ${generatingStates?.isTailoring ? 'ai-generating-container' : ''}`}>
          {generatingStates?.isTailoring && <div className="ai-generating-overlay no-print" />}
          <Section 
            title="Education"
            marginSection={marginSection}
            fontSizeSecTitle={fontSizeSecTitle}
            sectionTitlePaddingTop={sectionTitlePaddingTop}
            sectionTitleMarginBottom={sectionTitleMarginBottom}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: entryGap }}>
              {data.education.map((edu, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span 
                      style={{ fontSize: fontSizeEntryHeader, fontWeight: "bold", color: "#1a202c" }}
                    >
                      <AITextTransform 
                        text={edu.degree} 
                        isGenerating={generatingStates?.isTailoring} 
                        onRevert={(oldVal) => onRevertField?.("education", { ...edu, degree: oldVal }, idx)}
                      />
                    </span>
                    <span 
                      style={{ fontSize: fontSizePeriod, fontWeight: "bold", color: "#1a202c" }}
                    >
                      <AITextTransform 
                        text={edu.current 
                          ? (edu.year && edu.year.toLowerCase().includes("expected")
                            ? edu.year
                            : `Expected ${edu.year || "Present"}`)
                          : edu.year} 
                        isGenerating={generatingStates?.isTailoring} 
                        onRevert={(oldVal) => onRevertField?.("education", { ...edu, year: oldVal.replace(/^Expected\s+/i, "") }, idx)}
                      />
                    </span>
                  </div>
                  <div 
                    style={{ fontSize: fontSizeSub, color: "#4a5568" }}
                  >
                    <AITextTransform 
                      text={edu.school} 
                      isGenerating={generatingStates?.isTailoring} 
                      onRevert={(oldVal) => onRevertField?.("education", { ...edu, school: oldVal }, idx)}
                    />
                    {edu.gpa && (
                      <>
                        {" • "}
                        <AITextTransform 
                          text={(edu as any).gpaType === "percentage"
                            ? `Percentage: ${edu.gpa}${edu.gpa.includes('%') ? '' : '%'}`
                            : (edu as any).gpaType === "cgpa"
                              ? `CGPA: ${edu.gpa}`
                              : `GPA: ${edu.gpa}`
                          } 
                          isGenerating={generatingStates?.isTailoring} 
                          onRevert={(oldVal) => {
                             const cleanGpa = oldVal.replace(/^(GPA|CGPA|Percentage):\s*/i, "").replace(/%$/, "");
                             onRevertField?.("education", { ...edu, gpa: cleanGpa }, idx);
                           }}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Achievements */}
      {data.achievements &&
        data.achievements.some((a) => a.trim()) && (
          <div className={`relative overflow-hidden ${generatingStates?.isTailoring ? 'ai-generating-container' : ''}`}>
            {generatingStates?.isTailoring && <div className="ai-generating-overlay no-print" />}
            <Section 
              title="Achievements &amp; Certifications"
              marginSection={marginSection}
              fontSizeSecTitle={fontSizeSecTitle}
              sectionTitlePaddingTop={sectionTitlePaddingTop}
              sectionTitleMarginBottom={sectionTitleMarginBottom}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: bulletMarginBottom }}>
                {data.achievements
                  .filter((a) => a.trim())
                  .slice(0, 4)
                  .map((ach, idx) => {
                    const { title, date, url } = parseAchievementString(ach);
                    const href = url ? (url.startsWith("http") ? url : `https://${url}`) : null;
                    return (
                      <div key={idx} style={{ display: "flex", alignItems: "baseline" }}>
                        <span 
                          style={{ fontSize: fontSizeBody, marginRight: "6px", color: "#2d3748" }}
                        >
                          •
                        </span>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flex: 1 }}>
                          <span 
                            style={{ fontSize: fontSizeBody, color: "#2d3748" }}
                          >
                            <AITextTransform 
                              text={title} 
                              isGenerating={generatingStates?.isTailoring} 
                              onRevert={(oldTitle) => {
                                const updatedObj = {
                                  title: oldTitle,
                                  date: date || "",
                                  url: url || "",
                                };
                                onRevertField?.("achievements", JSON.stringify(updatedObj), idx);
                              }}
                            />
                            {href && (
                              <>
                                {" "}
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ textDecoration: "underline", color: "#1a0dab", fontWeight: "bold" }}
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  [Link]
                                </a>
                              </>
                            )}
                          </span>
                          {date && (
                            <span 
                              style={{ fontSize: fontSizeBody, fontWeight: "bold", color: "#1a202c", whiteSpace: "nowrap", marginLeft: "10px" }}
                            >
                              <AITextTransform 
                                text={date} 
                                isGenerating={generatingStates?.isTailoring} 
                                onRevert={(oldDate) => {
                                  const updatedObj = {
                                    title: title || "",
                                    date: oldDate,
                                    url: url || "",
                                  };
                                  onRevertField?.("achievements", JSON.stringify(updatedObj), idx);
                                }}
                              />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Section>
          </div>
        )}
    </div>
  );
}

/** Reusable section with a bold ruled header */
function Section({
  title,
  children,
  marginSection = "10px",
  fontSizeSecTitle = "9.5pt",
  sectionTitlePaddingTop = "3px",
  sectionTitleMarginBottom = "5px",
}: {
  title: string;
  children: React.ReactNode;
  marginSection?: string;
  fontSizeSecTitle?: string;
  sectionTitlePaddingTop?: string;
  sectionTitleMarginBottom?: string;
}) {
  return (
    <div style={{ marginBottom: marginSection }}>
      <div
        style={{
          fontSize: fontSizeSecTitle,
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          borderTop: "1.5px solid #1a202c",
          paddingTop: sectionTitlePaddingTop,
          marginBottom: sectionTitleMarginBottom,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function MinimalTemplate({
  data,
  projects,
  generatingStates,
  suggestions,
  onAcceptSuggestion,
  onDiscardSuggestion,
  onRevertField,
}: {
  data: CVData;
  projects: ProjectData[];
  generatingStates?: ResumePreviewProps["generatingStates"];
  suggestions?: ResumePreviewProps["suggestions"];
  onAcceptSuggestion?: ResumePreviewProps["onAcceptSuggestion"];
  onDiscardSuggestion?: ResumePreviewProps["onDiscardSuggestion"];
  onRevertField?: ResumePreviewProps["onRevertField"];
}) {
  return (
    <div
      className="bg-white text-black p-12 w-[210mm] min-h-[297mm] shadow-[0_0_50px_rgba(0,0,0,0.5)] font-sans"
      id="printable-resume"
    >
      <header className="border-b-2 border-black pb-4 mb-8 text-center">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">
          {data.name}
        </h1>
        <div className="flex justify-center gap-4 text-sm font-medium">
          <span>{data.email}</span>
          <span>•</span>
          <span>{data.github}</span>
        </div>
      </header>

      <section className={`relative overflow-hidden mb-8 ${generatingStates?.experienceIndex !== null || generatingStates?.isTailoring ? 'ai-generating-container' : ''}`}>
        {(generatingStates?.experienceIndex !== null || generatingStates?.isTailoring) && <div className="ai-generating-overlay no-print" />}
        <h2 className="text-xl font-bold border-b border-black mb-4 pb-1 uppercase tracking-wider">
          Experience
        </h2>
        <div className="space-y-6">
          {data.experience.map((exp, idx) => {
            const isGenerating = generatingStates?.experienceIndex === idx || generatingStates?.isTailoring;
            return (
              <div key={idx} className={`relative overflow-hidden ${isGenerating ? 'ai-generating-container' : ''}`}>
                {isGenerating && <div className="ai-generating-overlay no-print" />}
                <div className="flex justify-between items-baseline mb-1">
                  <h3 
                    className="text-lg font-bold"
                  >
                    <AITextTransform 
                      text={exp.title} 
                      isGenerating={isGenerating} 
                      onRevert={(oldVal) => onRevertField?.("experience", { ...exp, title: oldVal }, idx)}
                    />
                  </h3>
                  <span 
                    className="text-sm font-semibold italic text-neutral-600"
                  >
                    <AITextTransform 
                      text={exp.period} 
                      isGenerating={isGenerating} 
                      onRevert={(oldVal) => onRevertField?.("experience", { ...exp, period: oldVal }, idx)}
                    />
                  </span>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {(exp.bullets || []).map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="text-[11pt] leading-relaxed text-gray-800"
                    >
                      <AITextTransform 
                        text={bullet} 
                        isGenerating={isGenerating} 
                        onRevert={(oldBullet) => {
                          const nuBullets = [...exp.bullets];
                          nuBullets[bIdx] = oldBullet;
                          onRevertField?.("experience", { ...exp, bullets: nuBullets }, idx);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className={`relative overflow-hidden ${generatingStates?.skills || generatingStates?.isTailoring ? 'ai-generating-container' : ''}`}>
        {(generatingStates?.skills || generatingStates?.isTailoring) && <div className="ai-generating-overlay no-print" />}
        <h2 className="text-xl font-bold border-b border-black mb-4 pb-1 uppercase tracking-wider">
          Skills
        </h2>
        <div className="text-[11pt] leading-relaxed">
          <p>
            <span className="font-bold">Technical:</span>{" "}
            <AITextTransform 
              text={(data.skills?.languages || []).join(", ")} 
              isGenerating={generatingStates?.skills || generatingStates?.isTailoring} 
              onRevert={(oldVal) => onRevertField?.("skills", { ...data.skills, languages: oldVal.split(",").map((s: string) => s.trim()) })}
            />
            {", "}
            <AITextTransform 
              text={(data.skills?.frameworks || []).join(", ")} 
              isGenerating={generatingStates?.skills || generatingStates?.isTailoring} 
              onRevert={(oldVal) => onRevertField?.("skills", { ...data.skills, frameworks: oldVal.split(",").map((s: string) => s.trim()) })}
            />
          </p>
        </div>
      </section>
    </div>
  );
}
