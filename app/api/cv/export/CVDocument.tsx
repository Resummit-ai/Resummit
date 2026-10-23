import React from "react";
import { Page, Text, View, Document, StyleSheet, Link } from "@react-pdf/renderer";
import type { CVData, ProjectData } from "@/lib/types";
import { normalizeAndDedupeSkills, formatLinkedIn, formatGitHub } from "@/lib/skills-data";

// Standard Times-Roman styles matching the FormalTemplate in ResumePreview.tsx perfectly
// Dynamic styling configurations matching the FormalTemplate in ResumePreview.tsx
// Dynamic styling configurations matching the FormalTemplate in ResumePreview.tsx
const getDynamicConfig = (
  cv: CVData,
  cleanExperience: any[],
  includedProjects: any[],
  skills: { languages?: string[]; frameworks?: string[]; tools?: string[] },
  displaySummary: string
) => {
  const expCount = cleanExperience.length;
  const expBullets = cleanExperience.reduce((sum, e) => sum + (e.bullets?.length || 0), 0);
  const projCount = includedProjects.length;
  const projBullets = includedProjects.reduce((sum, p) => sum + (p.highlights?.length || 0), 0);
  const eduCount = (cv.education || []).length;
  const achCount = (cv.achievements || []).filter((a: string) => a && a.trim()).slice(0, 4).length;
  const summaryLength = displaySummary ? displaySummary.length : 0;

  // Accurate content volume units based on vertical layout footprints
  const volume =
    (summaryLength > 0 ? summaryLength / 85 : 0) +
    ((skills.languages?.length || skills.frameworks?.length || skills.tools?.length) ? 5 : 0) +
    (expCount * 2.8 + expBullets * 1.5) +
    (projCount * 2.8 + projBullets * 1.5) +
    (eduCount * 2.2) +
    (achCount * 1.5);

  if (volume >= 66) {
    // Extensive/dense content: tighter line heights and margins to strictly fit single A4 page
    return {
      volume,
      fontSizeBody: 7.5,
      fontSizeSecTitle: 8.5,
      fontSizeSummary: 7.8,
      fontSizeEntryHeader: 8.5,
      fontSizeSub: 7.8,
      fontSizePeriod: 7.5,
      fontSizeName: 18,
      lineHeightBody: 1.16,
      lineHeightSummary: 1.16,
      lineHeightSkills: 1.20,
      paddingHorizontal: 24,
      paddingVertical: 16,
      marginHeader: 5,
      marginSection: 5,
      sectionTitlePaddingTop: 1.6,
      sectionTitleMarginBottom: 2.2,
      entryGap: 3.2,
      bulletMarginBottom: 0.8,
      skillLineMarginBottom: 0.6,
    };
  } else if (volume >= 42) {
    // Full standard content (e.g. 2-3 jobs, 3 projects with bullets, education, achievements)
    // Fills standard A4 cleanly without crunching and without big gaps!
    return {
      volume,
      fontSizeBody: 8.35,
      fontSizeSecTitle: 9.4,
      fontSizeSummary: 8.55,
      fontSizeEntryHeader: 9.4,
      fontSizeSub: 8.5,
      fontSizePeriod: 8.35,
      fontSizeName: 21,
      lineHeightBody: 1.30,
      lineHeightSummary: 1.30,
      lineHeightSkills: 1.34,
      paddingHorizontal: 28,
      paddingVertical: 26,
      marginHeader: 10,
      marginSection: 11.5,
      sectionTitlePaddingTop: 2.6,
      sectionTitleMarginBottom: 3.8,
      entryGap: 6.2,
      bulletMarginBottom: 2.0,
      skillLineMarginBottom: 1.4,
    };
  } else if (volume >= 28) {
    // Moderate content: gently distributes space between sections to fill A4 gracefully
    return {
      volume,
      fontSizeBody: 8.5,
      fontSizeSecTitle: 9.5,
      fontSizeSummary: 8.8,
      fontSizeEntryHeader: 9.5,
      fontSizeSub: 8.6,
      fontSizePeriod: 8.5,
      fontSizeName: 21.5,
      lineHeightBody: 1.33,
      lineHeightSummary: 1.33,
      lineHeightSkills: 1.36,
      paddingHorizontal: 28,
      paddingVertical: 28,
      marginHeader: 11.5,
      marginSection: 13,
      sectionTitlePaddingTop: 2.8,
      sectionTitleMarginBottom: 4.2,
      entryGap: 7.0,
      bulletMarginBottom: 2.4,
      skillLineMarginBottom: 1.6,
    };
  } else {
    // Light content: expands sections and padding naturally so it fills A4 without empty voids
    return {
      volume,
      fontSizeBody: 8.7,
      fontSizeSecTitle: 9.8,
      fontSizeSummary: 9.0,
      fontSizeEntryHeader: 9.8,
      fontSizeSub: 8.8,
      fontSizePeriod: 8.7,
      fontSizeName: 22,
      lineHeightBody: 1.36,
      lineHeightSummary: 1.36,
      lineHeightSkills: 1.38,
      paddingHorizontal: 30,
      paddingVertical: 32,
      marginHeader: 13,
      marginSection: 14.5,
      sectionTitlePaddingTop: 3.0,
      sectionTitleMarginBottom: 4.8,
      entryGap: 8.0,
      bulletMarginBottom: 2.8,
      skillLineMarginBottom: 1.8,
    };
  }
};

const getDynamicStyles = (config: ReturnType<typeof getDynamicConfig>) => {
  return StyleSheet.create({
    page: {
      flexDirection: "column",
      fontFamily: "Times-Roman",
      backgroundColor: "#ffffff",
      fontSize: config.fontSizeBody,
      color: "#2d3748",
      paddingHorizontal: config.paddingHorizontal,
      paddingVertical: config.paddingVertical,
    },
    // ── Header ──
    header: {
      textAlign: "center",
      marginBottom: config.marginHeader,
    },
    name: {
      fontSize: config.fontSizeName,
      fontFamily: "Times-Bold",
      color: "#1a202c",
      marginBottom: 3,
    },
    contactRow: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      fontSize: config.volume > 66 ? 7.5 : 8,
      color: "#4a5568",
    },
    contactText: {
      fontSize: config.volume > 66 ? 7.5 : 8,
      fontFamily: "Times-Roman",
      color: "#4a5568",
    },
    contactSep: {
      fontSize: config.volume > 66 ? 7.5 : 8,
      color: "#4a5568",
      marginHorizontal: 4,
    },
    // ── Section Container ──
    section: {
      marginBottom: config.marginSection,
    },
    sectionTitle: {
      fontSize: config.fontSizeSecTitle,
      fontFamily: "Times-Bold",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      color: "#1a202c",
      borderTopWidth: 1.5,
      borderTopColor: "#1a202c",
      paddingTop: config.sectionTitlePaddingTop,
      marginBottom: config.sectionTitleMarginBottom,
    },
    // ── Professional Summary ──
    summaryText: {
      fontSize: config.fontSizeSummary,
      fontFamily: "Times-Roman",
      lineHeight: config.lineHeightSummary,
      color: "#2d3748",
    },
    // ── Skills ──
    skillsContainer: {
      fontSize: config.fontSizeBody,
      lineHeight: config.lineHeightSkills,
    },
    skillLine: {
      flexDirection: "row",
      marginBottom: config.skillLineMarginBottom,
    },
    skillLabel: {
      fontFamily: "Times-Bold",
      color: "#1a202c",
      marginRight: 4,
    },
    skillText: {
      fontFamily: "Times-Roman",
      color: "#2d3748",
    },
    // ── Generic Entry Row (Experience, Projects, Education) ──
    entry: {
      marginBottom: config.entryGap,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    entryTitleLeft: {
      fontSize: config.fontSizeEntryHeader,
      fontFamily: "Times-Bold",
      color: "#1a202c",
      flex: 1,
    },
    entryTimeRight: {
      fontSize: config.fontSizePeriod,
      fontFamily: "Times-Bold",
      color: "#1a202c",
      textAlign: "right",
      marginLeft: 10,
    },
    entryTimeRightItalic: {
      fontSize: config.volume > 66 ? 7.5 : 8,
      fontFamily: "Times-Italic",
      color: "#4a5568",
      textAlign: "right",
      marginLeft: 10,
    },
    entrySubtitle: {
      fontSize: config.fontSizeSub,
      fontFamily: "Times-Roman",
      color: "#4a5568",
      marginBottom: config.volume > 50 ? 1 : 3,
    },
    entryDescriptionItalic: {
      fontSize: config.fontSizeBody,
      fontFamily: "Times-Roman",
      color: "#2d3748",
      marginBottom: config.volume > 50 ? 1 : 3,
    },
    // ── Bullet Lists ──
    bulletRow: {
      flexDirection: "row",
      marginBottom: config.bulletMarginBottom,
      paddingLeft: 12,
    },
    bulletDot: {
      width: 3,
      height: 3,
      backgroundColor: "#2d3748",
      borderRadius: 1.5,
      marginRight: 6,
      marginTop: 4,
    },
    bulletText: {
      flex: 1,
      fontSize: config.fontSizeBody,
      fontFamily: "Times-Roman",
      lineHeight: config.lineHeightBody,
      color: "#2d3748",
    },
  });
};

function parseAchievementString(str: string) {
  if (!str) return { title: "", date: null, url: null };
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
  const parenDateRegex = /\(([^)]*(?:\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b)[^)]*)\)/i;
  let date: string | null = null;
  const parenMatch = tempStr.match(parenDateRegex);
  if (parenMatch) {
    date = parenMatch[1].trim();
    tempStr = tempStr.replace(parenDateRegex, "").trim();
  } else {
    const bareMonthYear = tempStr.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(20\d{2})\b/i);
    const bareYear = tempStr.match(/\b(20\d{2})\b/);
    if (bareMonthYear) {
      date = `${bareMonthYear[1]} ${bareMonthYear[2]}`;
      tempStr = tempStr.replace(bareMonthYear[0], "").trim();
    } else if (bareYear) {
      date = bareYear[1];
    }
  }
  const title = tempStr.replace(/\s*[-–—:]\s*$/, "").trim();
  return { title, date, url };
}

const parseAndRenderPdfText = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+|(?:credly\.com|coursera\.org|github\.com|linkedin\.com|devpost\.com|credly\.com\/badges)\/[^\s]+)/gi;
  const parts = text.split(urlRegex);
  return (
    <>
      {parts.map((part, index) => {
        if (part.match(urlRegex)) {
          const href = part.startsWith("http") ? part : `https://${part}`;
          let cleanLabel = part.replace(/^https?:\/\/(www\.)?/, "");
          if (cleanLabel.length > 40) {
            cleanLabel = cleanLabel.substring(0, 37) + "...";
          }
          return (
            <Link key={index} style={{ textDecoration: "underline", color: "#1a0dab" }} src={href}>
              {cleanLabel}
            </Link>
          );
        }
        return part;
      })}
    </>
  );
};

// Render bullets using simple bullet design matching standard HTML list styling
const BulletList = ({ bullets, styles }: { bullets: string[]; styles: any }) => (
  <View>
    {bullets.map((b, i) => (
      <View key={i} style={styles.bulletRow}>
        <View style={styles.bulletDot} />
        <Text style={styles.bulletText}>{parseAndRenderPdfText(b)}</Text>
      </View>
    ))}
  </View>
);

export const CVDocument = ({ cv, projects }: { cv: CVData; projects: ProjectData[] }) => {
  // Gracefully parse and normalize skills properties
  const rawSkills = typeof cv.skills === "string" ? JSON.parse(cv.skills as any) : cv.skills;
  const skills = normalizeAndDedupeSkills(rawSkills);
  const experience = typeof cv.experience === "string" ? JSON.parse(cv.experience as any) : cv.experience;
  const education = typeof cv.education === "string" ? JSON.parse(cv.education as any) : cv.education;

  // Sync filtration logic with ResumePreview (only included, max 3 projects)
  const includedProjects = (projects || [])
    .filter((p) => p.included !== false)
    .slice(0, 3)
    .map((p) => ({
      ...p,
      highlights: (p.highlights || []).filter((h) => h.trim()).slice(0, 2),
    }))
    .filter((p) => p.highlights.length > 0);

  const cleanExperience = (experience || []).slice(0, 3).map((exp: any) => ({
    ...exp,
    bullets: (exp.bullets || [])
      .filter((b: string) => b.trim() && b !== "Achieved X by implementing Y resulting in Z% growth.")
      .slice(0, 3),
  }));

  // Parse summary display
  let displaySummary = "";
  if (typeof cv.summary === "string") {
    displaySummary = cv.summary;
  } else if (cv.summary && typeof cv.summary === "object") {
    displaySummary = (cv.summary as any).summary || (cv.summary as any).Summary || JSON.stringify(cv.summary);
  }

  if (displaySummary && typeof displaySummary === "string" && displaySummary.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(displaySummary);
      displaySummary = parsed.summary || parsed.Summary || (Object.values(parsed)[0] as string);
    } catch { /* ignore */ }
  }

  // Calculate dynamic typography and vertical distribution to fill standard A4 cleanly
  const config = getDynamicConfig(cv, cleanExperience, includedProjects, skills, displaySummary);
  const styles = getDynamicStyles(config);

  // Identify the last rendered section so we can remove trailing section margin
  const hasAchievements = cv.achievements && cv.achievements.some((a: string) => a.trim());
  const hasEducation = education && education.length > 0;
  const hasProjects = includedProjects.length > 0;
  const hasExperience = cleanExperience.length > 0;
  const hasSkills =
    (skills.languages || []).length > 0 ||
    (skills.frameworks || []).length > 0 ||
    (skills.tools || []).length > 0;
  const hasSummary = Boolean(displaySummary && displaySummary.trim());

  let lastSection = "achievements";
  if (hasAchievements) lastSection = "achievements";
  else if (hasEducation) lastSection = "education";
  else if (hasProjects) lastSection = "projects";
  else if (hasExperience) lastSection = "experience";
  else if (hasSkills) lastSection = "skills";
  else if (hasSummary) lastSection = "summary";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Centered Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{cv.name || "Your Name"}</Text>
          <View style={styles.contactRow}>
            {cv.location ? <Text style={styles.contactText}>{cv.location}</Text> : null}
            {cv.email ? (
              <>
                {cv.location ? <Text style={styles.contactSep}>•</Text> : null}
                <Link style={{ ...styles.contactText, textDecoration: "underline" }} src={`mailto:${cv.email}`}>
                  {cv.email}
                </Link>
              </>
            ) : null}
            {cv.phone ? (
              <>
                {(cv.location || cv.email) ? <Text style={styles.contactSep}>•</Text> : null}
                <Text style={styles.contactText}>{cv.phone}</Text>
              </>
            ) : null}
            {cv.github ? (
              <>
                {(cv.location || cv.email || cv.phone) ? <Text style={styles.contactSep}>•</Text> : null}
                <Link
                  style={{ ...styles.contactText, textDecoration: "underline" }}
                  src={cv.github.startsWith("http") ? cv.github : `https://${cv.github}`}
                >
                  {formatGitHub(cv.github)}
                </Link>
              </>
            ) : null}
            {cv.linkedin ? (
              <>
                {(cv.location || cv.email || cv.phone || cv.github) ? <Text style={styles.contactSep}>•</Text> : null}
                <Link
                  style={{ ...styles.contactText, textDecoration: "underline" }}
                  src={cv.linkedin.startsWith("http") ? cv.linkedin : `https://${cv.linkedin}`}
                >
                  {formatLinkedIn(cv.linkedin)}
                </Link>
              </>
            ) : null}
          </View>
        </View>

        {/* Professional Summary */}
        {hasSummary && (
          <View style={lastSection === "summary" ? [styles.section, { marginBottom: 0 }] : styles.section}>
            <Text style={styles.sectionTitle}>{cv.targetRole ? "Technical Summary" : "Professional Summary"}</Text>
            <Text style={styles.summaryText}>{displaySummary}</Text>
          </View>
        )}

        {/* Technical Skills */}
        {hasSkills && (
          <View style={lastSection === "skills" ? [styles.section, { marginBottom: 0 }] : styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.skillsContainer}>
              {(skills.languages || []).length > 0 && (
                <View style={styles.skillLine}>
                  <Text style={styles.skillLabel}>Languages:</Text>
                  <Text style={styles.skillText}>{skills.languages.join(", ")}</Text>
                </View>
              )}
              {(skills.frameworks || []).length > 0 && (
                <View style={styles.skillLine}>
                  <Text style={styles.skillLabel}>Frameworks:</Text>
                  <Text style={styles.skillText}>{skills.frameworks.join(", ")}</Text>
                </View>
              )}
              {(skills.tools || []).length > 0 && (
                <View style={styles.skillLine}>
                  <Text style={styles.skillLabel}>Tools &amp; Cloud:</Text>
                  <Text style={styles.skillText}>{skills.tools.join(", ")}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Professional Experience */}
        {hasExperience && (
          <View style={lastSection === "experience" ? [styles.section, { marginBottom: 0 }] : styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {cleanExperience.map((exp: any, idx: number) => (
              <View key={idx} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitleLeft}>{exp.title}</Text>
                  <Text style={styles.entryTimeRight}>{exp.period}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{exp.company}</Text>
                {exp.bullets?.length > 0 && <BulletList bullets={exp.bullets} styles={styles} />}
              </View>
            ))}
          </View>
        )}

        {/* Technical Projects */}
        {hasProjects && (
          <View style={lastSection === "projects" ? [styles.section, { marginBottom: 0 }] : styles.section}>
            <Text style={styles.sectionTitle}>Technical Projects</Text>
            {includedProjects.map((project: any, idx: number) => {
              const techStr = Array.isArray(project.techStack)
                ? project.techStack.slice(0, 4).join(", ")
                : typeof project.techStack === "string"
                ? project.techStack
                : "";

              return (
                <View key={idx} style={styles.entry}>
                  <View style={styles.entryHeader}>
                    {project.githubUrl || project.liveUrl ? (
                      <Link
                        style={{ ...styles.entryTitleLeft, textDecoration: "underline" }}
                        src={project.githubUrl || project.liveUrl || ""}
                      >
                        {project.title || "Untitled Project"}
                      </Link>
                    ) : (
                      <Text style={styles.entryTitleLeft}>{project.title || "Untitled Project"}</Text>
                    )}
                    {techStr ? <Text style={styles.entryTimeRightItalic}>{techStr}</Text> : null}
                  </View>
                  {project.description && (
                    <Text style={styles.entryDescriptionItalic}>{project.description}</Text>
                  )}
                  {project.highlights?.length > 0 && <BulletList bullets={project.highlights} styles={styles} />}
                </View>
              );
            })}
          </View>
        )}

        {/* Education */}
        {hasEducation && (
          <View style={lastSection === "education" ? [styles.section, { marginBottom: 0 }] : styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu: any, idx: number) => (
              <View key={idx} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitleLeft}>{edu.degree}</Text>
                  <Text style={styles.entryTimeRight}>
                    {edu.current 
                      ? (edu.year && edu.year.toLowerCase().includes("expected")
                        ? edu.year
                        : `Expected ${edu.year || "Present"}`)
                      : edu.year}
                  </Text>
                </View>
                <Text style={styles.entrySubtitle}>
                  {edu.school}{edu.gpa ? ` • ${
                    edu.gpaType === "percentage"
                      ? `Percentage: ${edu.gpa}${edu.gpa.includes('%') ? '' : '%'}`
                      : edu.gpaType === "cgpa"
                        ? `CGPA: ${edu.gpa}`
                        : `GPA: ${edu.gpa}`
                  }` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Achievements & Certifications */}
        {hasAchievements && (
          <View style={lastSection === "achievements" ? [styles.section, { marginBottom: 0 }] : styles.section}>
            <Text style={styles.sectionTitle}>Achievements &amp; Certifications</Text>
            {(cv.achievements || [])
              .filter((a: string) => a.trim())
              .slice(0, 4)
              .map((ach: string, idx: number) => {
                const { title, date, url } = parseAchievementString(ach);
                const href = url ? (url.startsWith("http") ? url : `https://${url}`) : null;
                return (
                  <View key={idx} style={{ flexDirection: "row", marginBottom: 3.5, paddingLeft: 12 }}>
                    <View style={[styles.bulletDot, { marginTop: 3.5 }]} />
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                      <Text style={[styles.bulletText, { flex: 1 }]}>
                        {title}
                        {href ? (
                          <>
                            {" "}
                            <Link style={{ textDecoration: "underline", color: "#1a0dab", fontFamily: "Times-Bold" }} src={href}>
                              [Link]
                            </Link>
                          </>
                        ) : null}
                      </Text>
                      {date ? (
                        <Text style={{ fontSize: 8.5, fontFamily: "Times-Bold", color: "#1a202c", marginLeft: 10 }}>
                          {date}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
          </View>
        )}

      </Page>
    </Document>
  );
};
