import "server-only";
import type { Metadata } from "next";
import { auth, signOut } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { redirect } from "next/navigation";
import { LayoutDashboard, FileText, ArrowRight, Cpu, Activity, Target, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { SmartUpdateCenter } from "@/components/dashboard/SmartUpdateCenter";
import { DashboardControls } from "@/components/dashboard/DashboardControls";
import { ATSScoreCard } from "@/components/dashboard/ATSScoreCard";
import { UserIdentify } from "@/components/providers/user-identify";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { EngineeringSignals } from "@/lib/server/githubIntelligence";
import { logger } from "@/lib/server/logger";

export const metadata: Metadata = {
  title: "Resummit Dashboard — Developer Engineering DNA",
  description: "View your ATS scores, analyze stack confidence, track technical achievements, and manage your professional developer resume. Built on your real work, not templates.",
};
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const isSystemAdmin = Boolean(
    process.env.ADMIN_EMAIL && session.user.email === process.env.ADMIN_EMAIL
  );

  const userId = await resolveUserId(session);
  if (!userId) {
    redirect("/login");
  }

  let dbUser;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        suggestions: {
          where: { status: "PENDING" },
          orderBy: { priority: "desc" },
        },
        resumes: {
          include: {
            versions: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
        githubData: true,
      }
    });
  } catch (error) {
    logger.error("dashboard.db_lookup", error, { userId });
    return (
      <div className="min-h-screen bg-[var(--sclade-bg)] flex items-center justify-center p-6 text-center font-outfit">
        <div className="max-w-md p-8 rounded-2xl bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] shadow-sm">
          <h2 className="text-xl font-bold mb-2 text-[var(--sclade-text-primary)]">Something went wrong</h2>
          <p className="text-sm text-[var(--sclade-text-secondary)] mb-6">
            We couldn&apos;t load your dashboard data. Please refresh the page to try again.
          </p>
          <a
            href="/dashboard"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors inline-block"
          >
            Refresh
          </a>
        </div>
      </div>
    );
  }

  if (!dbUser) {
    redirect("/login");
  }

  const mainResume = dbUser.resumes[0];
  const mainVersion = mainResume?.versions[0];
  const signals = (dbUser.githubData?.signals as any) as EngineeringSignals || null;
  
  // Check if onboarding is needed
  const showOnboarding = (!dbUser.githubData || !signals) && dbUser.resumes.length === 0;

  if (showOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-[var(--sclade-bg)] text-[var(--sclade-text-primary)] selection:bg-blue-500/30 font-outfit transition-colors duration-200">
      {/* Identify user in PostHog — links all sessions to this user's email */}
      <UserIdentify
        userId={dbUser.id}
        email={dbUser.email ?? ""}
        name={dbUser.name}
        githubUsername={dbUser.githubUsername}
      />
      {/* Premium Gradient Header Background */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-600/[0.03] to-transparent pointer-events-none opacity-50 dark:opacity-100" />

      {/* Top Nav */}
      <nav className="relative z-50 border-b border-[var(--sclade-card-border)] bg-[var(--sclade-nav-bg)] backdrop-blur-xl sticky top-0 transition-colors duration-200 px-8 py-5">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className="logo scale-90 origin-left cursor-pointer hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 32 32" className="logo-icon-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 6C7 4.34315 8.34315 3 10 3H19L25 9V26C25 27.6569 23.6569 29 22 29H10C8.34315 29 7 27.6569 7 26V6Z" className="logo-doc-body" />
                <path d="M19 3V9H25L19 3Z" className="logo-doc-fold" />
                <path d="M11 13H17M11 17H21M11 21H18M11 25H20" className="logo-doc-lines" strokeWidth="2" strokeLinecap="round" />
                <path d="M20 8.5L25 3.5" className="logo-flag-pole" strokeWidth="2" strokeLinecap="round" />
                <path d="M25 3.5L27 6.5L23.5 5.5Z" className="logo-flag-banner" />
              </svg>
              <div className="logo-text-group">
                <div className="logo-wordmark">RESUMMIT</div>
                <div className="logo-tagline">YOUR COMMITS. YOUR CAREER.</div>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-[var(--sclade-text-secondary)]">
               <Link href="/dashboard" className="text-[var(--sclade-text-primary)] border-b-2 border-blue-500 pb-1 -mb-[22px]">Dashboard</Link>
               <Link href="/editor" className="hover:text-[var(--sclade-text-primary)] transition-colors">Editor</Link>
               {isSystemAdmin && (
                 <Link href="/admin" className="hover:text-[var(--sclade-text-primary)] text-blue-500 transition-colors">Admin</Link>
               )}
            </div>
          </div>
          <DashboardControls user={dbUser} />
        </div>
      </nav>

      <main className="relative z-10 w-full px-8 py-8 md:px-16 md:py-12 xl:py-16">
        <header className="mb-8">
           <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--sclade-text-primary)]">
             Welcome back, {dbUser.name?.split(' ')[0]}
           </h1>
           <p className="text-[var(--sclade-text-secondary)] mt-1.5 text-base">Orchestrate your professional impact and career logic.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Left/Middle Column - Suggestions & Activity */}
           <div className="lg:col-span-8 space-y-8">
              
               {/* Live ATS Score Card */}
               <ATSScoreCard
                 storedScore={mainVersion?.atsScore ?? 0}
                 versionId={mainVersion?.id}
                 resumeName={mainResume?.name}
                 versionName={mainVersion?.versionName}
               />

               {/* Engineering DNA Core */}
               {typeof signals?.stackConfidence === "number" ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] relative overflow-hidden transition-all shadow-xs">
                       <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                             <Cpu className="w-4 h-4 text-[#5473D1]" />
                             <h3 className="text-xs font-bold text-[var(--sclade-text-primary)] uppercase tracking-wider">Engineering DNA</h3>
                          </div>
                          <span className="px-2 py-0.5 bg-[#E7EDFF] text-[#5473D1] border border-[#CFD9FF] rounded text-[10px] font-bold uppercase tracking-wider">Verified</span>
                       </div>
                       
                       <div className="space-y-5">
                          <div>
                             <div className="flex justify-between text-xs font-semibold uppercase tracking-wider mb-2 text-[var(--sclade-text-secondary)]">
                                <span>Stack Confidence</span>
                                <span className="text-[var(--sclade-text-primary)] font-bold">{signals.stackConfidence}%</span>
                             </div>
                             <div className="w-full h-1.5 bg-[#F0F3F8] dark:bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#5473D1] rounded-full transition-all duration-1000" 
                                  style={{ width: `${Math.min(100, Math.max(0, signals.stackConfidence))}%` }} 
                                />
                             </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                             {(signals.topSkills || []).slice(0, 5).map((s: any, i: number) => (
                               <span key={i} className="px-2.5 py-1 bg-[#F0F3F8] dark:bg-neutral-800 border border-[var(--sclade-card-border)] rounded-lg text-xs font-medium text-[var(--sclade-text-primary)]">
                                 {s.name || s}
                               </span>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="p-6 rounded-xl bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] relative overflow-hidden transition-all shadow-xs">
                       <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                             <Activity className="w-4 h-4 text-[#32704F]" />
                             <h3 className="text-xs font-bold text-[var(--sclade-text-primary)] uppercase tracking-wider">Recruiter Perspective</h3>
                          </div>
                          <span className="px-2 py-0.5 bg-[#E4F2E9] text-[#32704F] border border-[#32704F]/20 rounded text-[10px] font-bold uppercase tracking-wider">Live</span>
                       </div>
                       
                       <div className="space-y-5">
                          <div className="flex items-center justify-between">
                             <div className="flex flex-col">
                                <span className="text-2xl font-bold text-[var(--sclade-text-primary)]">
                                  {typeof signals.recruiterReadability === "number" ? `${signals.recruiterReadability}%` : "—"}
                                </span>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sclade-text-muted)]">Scan Readability</span>
                             </div>
                             <div className="w-11 h-11 rounded-full border-3 border-[#E4F2E9] border-t-[#32704F] flex items-center justify-center">
                                <Target className="w-5 h-5 text-[#32704F]" />
                             </div>
                          </div>

                          <div className="p-3.5 bg-[#E4F2E9]/60 dark:bg-emerald-950/20 border border-[#32704F]/20 rounded-lg">
                             <p className="text-xs text-[#32704F] dark:text-emerald-300 leading-relaxed font-medium">
                                System detects strong <strong>{signals.strongestDomain || "Software Engineering"}</strong> domain expertise. 
                                Commit density is <strong>{signals.commitDensity || "Consistent"}</strong>.
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="p-5 rounded-xl bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] flex items-center justify-between transition-colors duration-200 shadow-xs">
                    <div className="flex items-center gap-3.5">
                       <div className="w-9 h-9 bg-[#E7EDFF] rounded-lg flex items-center justify-center text-[#5473D1]">
                          <Cpu className="w-4 h-4" />
                       </div>
                       <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--sclade-text-primary)]">Engineering Insights</h4>
                          <p className="text-xs text-[var(--sclade-text-secondary)]">Run a sync to generate insights</p>
                       </div>
                    </div>
                    <Link
                      href="/dashboard/syncing"
                      className="px-3.5 py-1.5 bg-[#5473D1] hover:bg-[#4261C0] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                    >
                      Run Sync
                    </Link>
                 </div>
               )}

               <SmartUpdateCenter 
                 initialSuggestions={dbUser.suggestions} 
                 lastSyncAt={dbUser.githubData?.lastSyncedAt?.toISOString() || null}
                 accessToken={session?.user ? (session.user as any).accessToken : null}
               />
           </div>

           {/* Right Column - Stats & Links */}
           <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-xl bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] shadow-xs transition-colors duration-200">
                 <h3 className="text-xs font-bold text-[var(--sclade-text-secondary)] uppercase tracking-wider mb-4">Quick Operations</h3>
                 <div className="space-y-3">
                    <Link href="/editor" className="group flex items-center justify-between p-3.5 bg-[var(--sclade-btn-secondary-bg)] rounded-lg border border-[var(--sclade-card-border)] text-[var(--sclade-text-primary)] hover:border-[#CFD9FF] hover:bg-[#E7EDFF]/50 transition-all">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#E7EDFF] rounded-lg flex items-center justify-center text-[#5473D1] group-hover:scale-105 transition-transform">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-wider">Resume Editor</span>
                            <span className="text-[10px] text-[var(--sclade-text-secondary)]">
                               {mainResume?.updatedAt ? `Updated ${new Date(mainResume.updatedAt).toLocaleDateString()}` : "Not started"}
                            </span>
                          </div>
                       </div>
                       <ArrowRight className="w-4 h-4 text-[var(--sclade-text-muted)] group-hover:text-[#5473D1] group-hover:translate-x-1 transition-all" />
                    </Link>
                    <Link href="/dashboard/syncing" className="group flex items-center justify-between p-3.5 bg-[var(--sclade-btn-secondary-bg)] rounded-lg border border-[var(--sclade-card-border)] text-[var(--sclade-text-primary)] hover:border-[#CFD9FF] hover:bg-[#E7EDFF]/50 transition-all">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#E7EDFF] rounded-lg flex items-center justify-center text-[#5473D1] group-hover:scale-105 transition-transform">
                            <LayoutDashboard className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-wider">Import from GitHub</span>
                            <span className="text-[10px] text-[var(--sclade-text-secondary)]">
                               {dbUser.githubData ? "Repositories synced" : "Connect GitHub"}
                            </span>
                          </div>
                       </div>
                       <ArrowRight className="w-4 h-4 text-[var(--sclade-text-muted)] group-hover:text-[#5473D1] group-hover:translate-x-1 transition-all" />
                    </Link>
                    {isSystemAdmin && (
                       <Link href="/admin" className="group flex items-center justify-between p-3.5 bg-[var(--sclade-btn-secondary-bg)] rounded-lg border border-[var(--sclade-card-border)] text-[var(--sclade-text-primary)] hover:border-[#CFD9FF] hover:bg-[#E7EDFF]/50 transition-all">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-[#E4F2E9] rounded-lg flex items-center justify-center text-[#32704F] group-hover:scale-105 transition-transform">
                               <Shield className="w-4 h-4" />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase tracking-wider">Admin Console</span>
                                <span className="text-[10px] text-[var(--sclade-text-secondary)]">
                                   Broadcasts & Registry
                                </span>
                             </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[var(--sclade-text-muted)] group-hover:text-[#32704F] group-hover:translate-x-1 transition-all" />
                       </Link>
                    )}
                 </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-[#5473D1] to-[#4261C0] text-white shadow-xs">
                 <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">Resummit Pro</h3>
                    <span className="px-2 py-0.5 bg-white/20 text-white text-[9px] font-bold uppercase tracking-wider rounded-md">Coming Soon</span>
                 </div>
                 <p className="text-blue-50 text-xs mb-5 leading-relaxed opacity-90">Unlock real-time ATS monitoring and multi-version resume management.</p>
                 <button disabled className="w-full py-2.5 bg-white/15 border border-white/30 text-white font-bold rounded-lg text-xs cursor-not-allowed select-none transition-all">
                    Coming Soon
                 </button>
              </div>

              <div className="pt-2">
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                   <button
                     type="submit"
                     className="block w-full py-2.5 text-center text-red-600/80 hover:text-red-600 text-xs font-semibold transition-all border border-red-200 dark:border-red-900/30 rounded-lg cursor-pointer bg-transparent hover:bg-red-50 dark:hover:bg-red-950/20"
                   >
                      Sign Out
                   </button>
                </form>
             </div>
           </div>

        </div>
      </main>
    </div>
  );
}
