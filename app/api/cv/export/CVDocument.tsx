import React from "react";
import { Page, Text, View, Document, StyleSheet, Link } from "@react-pdf/renderer";
import type { CVData, ProjectData } from "@/lib/types";
import { normalizeAndDedupeSkills, formatLinkedIn, formatGitHub } from "@/lib/skills-data";

// Standard Times-Roman styles matching the FormalTemplate in ResumePreview.tsx perfectly
// Dynamic styling configurations matching the FormalTemplate in ResumePreview.tsx
const getDynamicConfig = (score: number) => {
  let fontSizeBody = 8.2;
  let fontSizeSecTitle = 9.2;
  let fontSizeSummary = 8.5;
  let fontSizeEntryHeader = 9.2;
  let fontSizeSub = 8.5;
  let fontSizePeriod = 8.2;
  let fontSizeName = 20;

  let lineHeightBody = 1.25;
  let lineHeightSummary = 1.25;
  let lineHeightSkills = 1.3;

  let paddingHorizontal = 28; // ~10mm
  let paddingVertical = 20;   // ~7mm
  let marginHeader = 6;
  let marginSection = 6;
  let sectionTitlePaddingTop = 2;
  let sectionTitleMarginBottom = 3;
  let entryGap = 4.5;
  let bulletMarginBottom = 1.2;
  let skillLineMarginBottom = 1;

  if (score >= 45) {
    // Extensive content: 3+ jobs, 3+ projects, long summary
    fontSizeBody = 7.2;
    fontSizeSecTitle = 8;
    fontSizeSummary = 7.5;
    fontSizeEntryHeader = 8;
    fontSizeSub = 7.5;
    fontSizePeriod = 7.2;
    fontSizeName = 17;

    lineHeightBody = 1.12;
    lineHeightSummary = 1.12;
    lineHeightSkills = 1.16;

    paddingHorizontal = 24;
    paddingVertical = 14;
    marginHeader = 3.5;
    marginSection = 3.5;
    sectionTitlePaddingTop = 1.2;
    sectionTitleMarginBottom = 1.5;
    entryGap = 2.5;
    bulletMarginBottom = 0.5;
    skillLineMarginBottom = 0.5;
  } else if (score >= 32) {
    // Standard full resume (e.g. 2-3 jobs, 2-3 projects with multiple bullets)
    fontSizeBody = 7.8;
    fontSizeSecTitle = 8.8;
    fontSizeSummary = 8;
    fontSizeEntryHeader = 8.8;
    fontSizeSub = 8;
    fontSizePeriod = 7.8;
    fontSizeName = 19;

    lineHeightBody = 1.2;
    lineHeightSummary = 1.2;
    lineHeightSkills = 1.24;

    paddingHorizontal = 26;
    paddingVertical = 18;
    marginHeader = 4.5;
    marginSection = 5;
    sectionTitlePaddingTop = 1.8;
    sectionTitleMarginBottom = 2.2;
    entryGap = 3.5;
    bulletMarginBottom = 1;
    skillLineMarginBottom = 0.8;
  } else if (score < 22) {
    // Light content: expand slightly so it nicely breathes without cramped voids
    fontSizeBody = 8.5;
    fontSizeSecTitle = 9.5;
    fontSizeSummary = 8.8;
    fontSizeEntryHeader = 9.5;
    fontSizeSub = 8.6;
    fontSizePeriod = 8.4;
    fontSizeName = 21;

    lineHeightBody = 1.32;
    lineHeightSummary = 1.32;
    lineHeightSkills = 1.35;

    paddingHorizontal = 28;
    paddingVertical = 22;
    marginHeader = 7;
    marginSection = 7;
    sectionTitlePaddingTop = 2.5;
    sectionTitleMarginBottom = 3.5;
    entryGap = 5.5;
    bulletMarginBottom = 1.8;
    skillLineMarginBottom = 1.2;
  }

  return {
    score,
    fontSizeBody,
    fontSizeSecTitle,
    fontSizeSummary,
    fontSizeEntryHeader,
    fontSizeSub,
    fontSizePeriod,
    fontSizeName,
    lineHeightBody,
    lineHeightSummary,
    lineHeightSkills,
    paddingHorizontal,
    paddingVertical,
    marginHeader,
    marginSection,
    sectionTitlePaddingTop,
    sectionTitleMarginBottom,
    entryGap,
    bulletMarginBottom,
    skillLineMarginBottom,
  };
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
      fontSize: config.score > 48 ? 7.5 : 8,
      color: "#4a5568",
    },
    contactText: {
      fontSize: config.score > 48 ? 7.5 : 8,
      fontFamily: "Times-Roman",
      color: "#4a5568",
    },
    contactSep: {
      fontSize: config.score > 48 ? 7.5 : 8,
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
      fontSize: config.score > 48 ? 7.5 : 8,
      fontFamily: "Times-Italic",
      color: "#4a5568",
      textAlign: "right",
      marginLeft: 10,
    },
    entrySubtitle: {
      fontSize: config.fontSizeSub,
      fontFamily: "Times-Roman",
      color: "#4a5568",
      marginBottom: config.score > 35 ? 1 : 3,
    },
    entryDescriptionItalic: {
      fontSize: config.fontSizeBody,
      fontFamily: "Times-Roman",
      color: "#2d3748",
      marginBottom: config.score > 35 ? 1 : 3,
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

// Accurately estimates the rendered content height of the resume to dynamically size the PDF
function estimateContentHeight(
  cv: CVData,
  cleanExperience: any[],
  includedProjects: any[],
  skills: { languages: string[]; frameworks: string[]; tools: string[] },
  displaySummary: string,
  config: ReturnType<typeof getDynamicConfig>,
  lastSection: string
): number {
  const printableWidth = 595.28 - config.paddingHorizontal * 2;
  let totalHeight = 0;

  // 1. Header: Name
  totalHeight += config.fontSizeName * 1.15 + 3;

  // Contact row
  const contactParts: string[] = [];
  if (cv.location) contactParts.push(cv.location);
  if (cv.email) contactParts.push(cv.email);
  if (cv.phone) contactParts.push(cv.phone);
  if (cv.github) contactParts.push(formatGitHub(cv.github));
  if (cv.linkedin) contactParts.push(formatLinkedIn(cv.linkedin));
  if (contactParts.length > 0) {
    const contactStr = contactParts.join(" • ");
    const contactLines = Math.max(1, Math.ceil((contactStr.length * 4.4) / printableWidth));
    totalHeight += contactLines * (config.score > 48 ? 7.5 : 8) * 1.35;
  }
  totalHeight += config.marginHeader;

  const secTitleHeight =
    config.fontSizeSecTitle + config.sectionTitlePaddingTop + config.sectionTitleMarginBottom + 1.5;

  // 2. Summary
  if (displaySummary && displaySummary.trim().length > 0) {
    totalHeight += secTitleHeight;
    const charWidth = 0.46 * config.fontSizeSummary;
    const charsPerLine = Math.floor(printableWidth / charWidth);
    const summaryLines = Math.max(1, Math.ceil(displaySummary.length / Math.max(charsPerLine * 0.88, 1)));
    totalHeight += summaryLines * (config.fontSizeSummary * config.lineHeightSummary);
    if (lastSection !== "summary") totalHeight += config.marginSection;
  }

  // 3. Technical Skills
  const hasSkills =
    (skills.languages || []).length > 0 ||
    (skills.frameworks || []).length > 0 ||
    (skills.tools || []).length > 0;
  if (hasSkills) {
    totalHeight += secTitleHeight;
    const charWidth = 0.46 * config.fontSizeBody;
    const charsPerLine = Math.floor(printableWidth / charWidth);

    if ((skills.languages || []).length > 0) {
      const lineStr = `Languages: ${skills.languages.join(", ")}`;
      const lines = Math.max(1, Math.ceil(lineStr.length / Math.max(charsPerLine * 0.88, 1)));
      totalHeight += lines * (config.fontSizeBody * config.lineHeightSkills) + config.skillLineMarginBottom;
    }
    if ((skills.frameworks || []).length > 0) {
      const lineStr = `Frameworks: ${skills.frameworks.join(", ")}`;
      const lines = Math.max(1, Math.ceil(lineStr.length / Math.max(charsPerLine * 0.88, 1)));
      totalHeight += lines * (config.fontSizeBody * config.lineHeightSkills) + config.skillLineMarginBottom;
    }
    if ((skills.tools || []).length > 0) {
      const lineStr = `Tools & Cloud: ${skills.tools.join(", ")}`;
      const lines = Math.max(1, Math.ceil(lineStr.length / Math.max(charsPerLine * 0.88, 1)));
      totalHeight += lines * (config.fontSizeBody * config.lineHeightSkills) + config.skillLineMarginBottom;
    }
    if (lastSection !== "skills") totalHeight += config.marginSection;
  }

  // 4. Professional Experience
  if (cleanExperience.length > 0) {
    totalHeight += secTitleHeight;
    const bulletPrintableWidth = printableWidth - 21;
    const bulletCharWidth = 0.46 * config.fontSizeBody;
    const bulletCharsPerLine = Math.floor(bulletPrintableWidth / bulletCharWidth);

    for (const exp of cleanExperience) {
      totalHeight += Math.max(config.fontSizeEntryHeader, config.fontSizePeriod) * 1.25;
      totalHeight += config.fontSizeSub * 1.25 + (config.score > 35 ? 1 : 3);

      for (const bullet of exp.bullets || []) {
        const lines = Math.max(1, Math.ceil(bullet.length / Math.max(bulletCharsPerLine * 0.88, 1)));
        totalHeight += lines * (config.fontSizeBody * config.lineHeightBody) + config.bulletMarginBottom;
      }
      totalHeight += config.entryGap;
    }
    if (lastSection !== "experience") totalHeight += config.marginSection;
  }

  // 5. Technical Projects
  if (includedProjects.length > 0) {
    totalHeight += secTitleHeight;
    const highlightPrintableWidth = printableWidth - 21;
    const highlightCharWidth = 0.46 * config.fontSizeBody;
    const highlightCharsPerLine = Math.floor(highlightPrintableWidth / highlightCharWidth);

    for (const project of includedProjects) {
      totalHeight += config.fontSizeEntryHeader * 1.25;
      if (project.description && project.description.trim()) {
        const charWidth = 0.46 * config.fontSizeBody;
        const charsPerLine = Math.floor(printableWidth / charWidth);
        const lines = Math.max(1, Math.ceil(project.description.length / Math.max(charsPerLine * 0.9, 1)));
        totalHeight += lines * (config.fontSizeBody * 1.2) + (config.score > 35 ? 1 : 3);
      }
      for (const highlight of project.highlights || []) {
        const lines = Math.max(1, Math.ceil(highlight.length / Math.max(highlightCharsPerLine * 0.88, 1)));
        totalHeight += lines * (config.fontSizeBody * config.lineHeightBody) + config.bulletMarginBottom;
      }
      totalHeight += config.entryGap;
    }
    if (lastSection !== "projects") totalHeight += config.marginSection;
  }

  // 6. Education
  const education = typeof cv.education === "string" ? JSON.parse(cv.education as any) : cv.education;
  if (education && education.length > 0) {
    totalHeight += secTitleHeight;
    for (const edu of education) {
      totalHeight += config.fontSizeEntryHeader * 1.25;
      totalHeight += config.fontSizeSub * 1.25;
      totalHeight += config.entryGap;
    }
    if (lastSection !== "education") totalHeight += config.marginSection;
  }

  // 7. Achievements
  const achievements = (cv.achievements || []).filter((a: string) => a && a.trim()).slice(0, 4);
  if (achievements.length > 0) {
    totalHeight += secTitleHeight;
    for (const ach of achievements) {
      const { title } = parseAchievementString(ach);
      const lines = Math.max(1, Math.ceil(title.length / 85));
      totalHeight += lines * (config.fontSizeBody * 1.3) + 3.5;
    }
    if (lastSection !== "achievements") totalHeight += config.marginSection;
  }

  // Top & bottom page padding
  totalHeight += config.paddingVertical * 2;

  return totalHeight;
}

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

  // Calculate dynamic density score for PDF scaling matching ResumePreview
  const expCount = cleanExperience.length;
  const expBullets = cleanExperience.reduce((sum: number, e: any) => sum + (e.bullets?.length || 0), 0);
  const projCount = includedProjects.length;
  const projBullets = includedProjects.reduce((sum: number, p: any) => sum + (p.highlights?.length || 0), 0);
  const eduCount = (education || []).length;
  const achCount = (cv.achievements || []).filter((a: string) => a.trim()).slice(0, 4).length;
  const summaryLength = displaySummary ? displaySummary.length : 0;

  const score =
    expCount * 3 +
    expBullets * 1 +
    projCount * 3 +
    projBullets * 1 +
    eduCount * 2 +
    achCount * 1.5 +
    (summaryLength > 200 ? Math.ceil(summaryLength / 80) : 2);

  const config = getDynamicConfig(score);
  const styles = getDynamicStyles(config);

  // Identify the last rendered section so we can remove trailing section margin
  // for perfectly symmetrical top & bottom padding without empty bottom space.
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

  // Calculate dynamic content-fit height:
  // Standard A4 dimensions: Width = 595.28pt, Height = 841.89pt.
  // If content is less than A4, page height is fitted cleanly to the content
  // so the downloaded PDF has ZERO blank bottom space.
  // If content is full, page height caps at 841.89pt (A4) to strictly enforce 1 page.
  const estimatedHeight = estimateContentHeight(
    cv,
    cleanExperience,
    includedProjects,
    skills,
    displaySummary,
    config,
    lastSection
  );

  const pageHeight = Math.min(841.89, Math.max(340, Math.ceil(estimatedHeight + 12)));

  return (
    <Document>
      <Page size={[595.28, pageHeight]} style={styles.page}>
        
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
