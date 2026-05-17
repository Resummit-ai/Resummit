import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import type { CVData, ProjectData } from "@/lib/types";

const COL_LEFT = "30%";
const COL_RIGHT = "70%";

const COLORS = {
  black: "#1a1a1b",
  darkGray: "#333333",
  stone: "#78716c", // stone-500
  lightStone: "#a8a29e", // stone-400
  sidebarBg: "#f9f9f8",
  border: "#efefee",
  accent: "#2563eb", // blue-600
} as const;

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    fontSize: 10,
    color: COLORS.black,
  },
  // ── Header ──
  header: {
    paddingHorizontal: 60,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "#fcfcfa",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f0",
  },
  name: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 4,
    color: "#000000",
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  contactText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.stone,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  contactSep: {
    fontSize: 9,
    color: "#d6d3d1",
  },
  linkText: {
    color: COLORS.accent,
    fontFamily: "Helvetica-Bold",
  },
  // ── Body ──
  body: {
    flexDirection: "row",
    flex: 1,
  },
  leftCol: {
    width: COL_LEFT,
    backgroundColor: COLORS.sidebarBg,
    borderRightWidth: 1,
    borderRightColor: "#f1f1f0",
    paddingHorizontal: 35,
    paddingVertical: 35,
  },
  rightCol: {
    width: COL_RIGHT,
    paddingHorizontal: 40,
    paddingVertical: 35,
  },
  // ── Sections ──
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 2.5,
    color: COLORS.lightStone,
    borderBottomWidth: 0.8,
    borderBottomColor: "#e7e5e4",
    paddingBottom: 5,
    marginBottom: 15,
  },
  // ── Skills ──
  skillCategory: {
    marginBottom: 12,
  },
  skillLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: COLORS.black,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 9,
    color: COLORS.darkGray,
    lineHeight: 1.6,
  },
  // ── Education ──
  eduEntry: {
    marginBottom: 12,
  },
  eduSchool: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.black,
    marginBottom: 2,
  },
  eduDegree: {
    fontSize: 9,
    color: COLORS.stone,
    marginBottom: 2,
  },
  eduYear: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: COLORS.lightStone,
  },
  // ── Summary ──
  summaryText: {
    fontSize: 11,
    color: COLORS.darkGray,
    lineHeight: 1.7,
  },
  // ── Experience / Projects ──
  entry: {
    marginBottom: 20,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
    flex: 1,
  },
  entryTime: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: COLORS.lightStone,
    textAlign: "right",
    marginLeft: 10,
  },
  entrySubtitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.accent,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  entryTech: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: COLORS.lightStone,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 0.8,
    borderColor: "#e7e5e4",
    borderRadius: 2,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 6,
    marginTop: 6,
    height: 3,
    backgroundColor: "#d6d3d1",
    borderRadius: 1.5,
    marginRight: 8,
  },
  bulletProjectDot: {
    backgroundColor: "rgba(37,99,235,0.2)",
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.2)",
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.darkGray,
    lineHeight: 1.6,
  },
  // ── Footer ──
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#f1f1f0",
    paddingVertical: 15,
    backgroundColor: "#f9f9f8",
    textAlign: "center",
    marginTop: "auto",
  },
  footerText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#d6d3d1",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
});

const BulletList = ({ bullets, isProject = false }: { bullets: string[]; isProject?: boolean }) => (
  <View>
    {bullets.map((b, i) => (
      <View key={i} style={styles.bulletRow}>
        <View style={[styles.bulletDot, isProject ? styles.bulletProjectDot : {}]} />
        <Text style={styles.bulletText}>{b}</Text>
      </View>
    ))}
  </View>
);

export const CVDocument = ({ cv, projects }: { cv: CVData; projects: ProjectData[] }) => {
  const skills = typeof cv.skills === "string" ? JSON.parse(cv.skills as any) : cv.skills;
  const experience = typeof cv.experience === "string" ? JSON.parse(cv.experience as any) : cv.experience;
  const education = typeof cv.education === "string" ? JSON.parse(cv.education as any) : cv.education;
  const includedProjects = (projects || [])
    .filter((p) => p.included !== false)
    .slice(0, 3);

  const contactParts: { label: string; isLink?: boolean }[] = [
    { label: cv.email },
    { label: cv.phone },
    { label: cv.location },
    { label: cv.github, isLink: true },
    { label: cv.linkedin, isLink: true },
  ].filter((p) => !!p.label) as { label: string; isLink?: boolean }[];

  // Sanitize summary display (strip JSON strings if present)
  let displaySummary = cv.summary || "";
  if (displaySummary.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(displaySummary);
      displaySummary = parsed.summary || parsed.Summary || Object.values(parsed)[0] as string;
    } catch { /* ignore */ }
  }

  const headerCenteredStyles = StyleSheet.create({
    header: {
      paddingHorizontal: 60,
      paddingTop: 50,
      paddingBottom: 30,
      backgroundColor: "#ffffff",
      borderBottomWidth: 2,
      borderBottomColor: "#000000",
      textAlign: "center",
      alignItems: "center",
    },
    name: {
      fontSize: 32,
      fontFamily: "Helvetica-Bold",
      textTransform: "uppercase",
      letterSpacing: -1,
      color: "#000000",
      marginBottom: 6,
    },
    contactRow: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 6,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Centered Header */}
        <View style={headerCenteredStyles.header}>
          <Text style={headerCenteredStyles.name}>{cv.name || "Your Name"}</Text>
          <View style={headerCenteredStyles.contactRow}>
            {contactParts.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Text style={[styles.contactSep, { marginHorizontal: 4 }]}> | </Text>}
                <Text style={[styles.contactText, { color: part.isLink ? COLORS.accent : COLORS.darkGray }]}>
                  {part.label.replace(/^https?:\/\//, '')}
                </Text>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Two Column Body */}
        <View style={styles.body}>
          {/* Left Column */}
          <View style={styles.leftCol}>
            {/* Skills */}
            {(skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Technical Mastery</Text>
                {skills.languages?.length > 0 && (
                  <View style={styles.skillCategory}>
                    <Text style={styles.skillLabel}>Languages</Text>
                    <Text style={styles.skillText}>{skills.languages.join(", ")}</Text>
                  </View>
                )}
                {skills.frameworks?.length > 0 && (
                  <View style={styles.skillCategory}>
                    <Text style={styles.skillLabel}>Core Stack</Text>
                    <Text style={styles.skillText}>{skills.frameworks.join(", ")}</Text>
                  </View>
                )}
                {skills.tools?.length > 0 && (
                  <View style={styles.skillCategory}>
                    <Text style={styles.skillLabel}>Ecosystem</Text>
                    <Text style={styles.skillText}>{skills.tools.join(", ")}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Education */}
            {education?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {education.map((edu: any, i: number) => (
                  <View key={i} style={styles.eduEntry}>
                    <Text style={styles.eduSchool}>{edu.school}</Text>
                    <Text style={styles.eduDegree}>{edu.degree}</Text>
                    <Text style={styles.eduYear}>{edu.year}</Text>
                    {edu.gpa && <Text style={{ fontSize: 8, color: COLORS.stone, marginTop: 2 }}>GPA {edu.gpa}</Text>}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightCol}>
            {/* Summary */}
            {displaySummary && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: "#000000", borderBottomColor: "#000000" }]}>Executive Brief</Text>
                <Text style={styles.summaryText}>{displaySummary}</Text>
              </View>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: "#000000", borderBottomColor: "#000000" }]}>Professional Trajectory</Text>
                {experience.map((exp: any, i: number) => (
                  <View key={i} style={styles.entry}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>{exp.company}</Text>
                      <Text style={styles.entryTime}>{exp.period}</Text>
                    </View>
                    <Text style={styles.entrySubtitle}>{exp.title}</Text>
                    {exp.bullets?.length > 0 && <BulletList bullets={exp.bullets} />}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {includedProjects.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: "#000000", borderBottomColor: "#000000" }]}>Selected Deep Work</Text>
                {includedProjects.map((p, i) => {
                  const bullets = Array.isArray(p.highlights) ? p.highlights : (typeof p.highlights === "string" ? JSON.parse(p.highlights as any) : []);
                  const techStr = Array.isArray(p.techStack) ? p.techStack.join(", ") : p.techStack;
                  return (
                    <View key={i} style={styles.entry}>
                      <View style={styles.entryHeader}>
                        <Text style={styles.entryTitle}>{p.title || "Untitled Project"}</Text>
                        {techStr ? <Text style={styles.entryTech}>{techStr}</Text> : null}
                      </View>
                      {bullets?.length > 0 && <BulletList bullets={bullets} isProject />}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 40 }]}>
          <Text style={styles.footerText}>Verified Semantic Intelligence Audit</Text>
          <Text style={[styles.footerText, { letterSpacing: 1 }]}>Integrity Level: High</Text>
        </View>
      </Page>
    </Document>
  );
};
