import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { redirect } from "next/navigation";
import { EditorClient } from "./EditorClient";

export default async function EditorPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Load user's projects
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // If no projects, redirect to start onboarding
  if (projects.length === 0) {
    redirect("/dashboard");
  }

  // Fetch or create CV
  let cv = await prisma.cV.findUnique({
    where: { userId: session.user.id }
  });

  if (!cv) {
    cv = await prisma.cV.create({
      data: {
        userId: session.user.id,
        name: session.user.name || "GitHub User",
        email: session.user.email || "",
      }
    });
  }

  const defaultGithub = session.user.name ? `github.com/${session.user.name.replace(/\s+/g, '')}` : "";

  // Parse server-side JSON to pass clean object down
  const parsedCV = {
    ...cv,
    github: cv.github || defaultGithub,
    skills: JSON.parse(cv.skills),
    experience: JSON.parse(cv.experience),
    education: JSON.parse(cv.education),
  };

  const formattedProjects = projects.map((p: typeof projects[number]) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    techStack: p.techStack,
    bullets: JSON.parse(p.bullets),
    repoUrl: p.repoUrl,
  }));

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-950">
      <EditorClient 
        initialCV={parsedCV} 
        initialProjects={formattedProjects} 
      />
    </div>
  );
}
