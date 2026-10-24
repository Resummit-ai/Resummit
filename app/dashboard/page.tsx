
import "server-only";
import type { Metadata } from "next";
import { auth, signOut } from "@/auth";
import { prisma, resolveUserId } from "@/lib/server/prisma";
import { redirect } from "next/navigation";
import {
  FileText,
  ChevronRight,
  Shield,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { SmartUpdateCenter } from "@/components/dashboard/SmartUpdateCenter";
import { DashboardControls } from "@/components/dashboard/DashboardControls";
import { ATSScoreCard } from "@/components/dashboard/ATSScoreCard";
import { UserIdentify } from "@/components/providers/user-identify";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { EngineeringSignals } from "@/lib/server/githubIntelligence";
import { logger } from "@/lib/server/logger";
import { DashboardPixelBanner } from "@/components/dashboard/DashboardPixelBanner";

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
    <div className="min-h-screen dashboard-root text-[#171717] dark:text-[#f2efe9] selection:bg-neutral-800 selection:text-white font-sans antialiased transition-colors duration-300">
      <style>{`
        .dashboard-root {
          background-color: #F5F5F3;
          background-image: radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .dark .dashboard-root,
        [data-theme="dark"] .dashboard-root {
          background-color: #0a0a0a;
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>

      {/* Identify user in PostHog */}
      <UserIdentify
        userId={dbUser.id}
        email={dbUser.email ?? ""}
        name={dbUser.name}
        githubUsername={dbUser.githubUsername}
      />

      {/* Top Nav matching Landing Page Theme */}
      <nav className="relative z-50 border-b border-[#E5E5E5] dark:border-[#27272a] bg-[#F5F5F3]/85 dark:bg-[#0a0a0a]/85 backdrop-blur-xl sticky top-0 transition-colors duration-200 px-3.5 sm:px-6 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-10">
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
                <div className="logo-tagline hidden sm:block">YOUR CAREER. YOUR CONTROL.</div>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-neutral-400">
              <Link href="/dashboard" className="text-blue-600 dark:text-[#0099ff] border-b-2 border-blue-600 dark:border-[#0099ff] pb-1 -mb-[18px]">Dashboard</Link>
              <Link href="/editor" className="hover:text-[#171717] dark:hover:text-[#f2efe9] transition-colors">Resume Editor</Link>
              {isSystemAdmin && (
                <Link href="/admin" className="hover:text-[#171717] dark:hover:text-[#f2efe9] text-blue-600 dark:text-[#0099ff] transition-colors">Admin</Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <DashboardControls user={dbUser} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 py-6 md:py-10 xl:py-12">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#171717] dark:text-[#f2efe9]">
              Welcome back, {dbUser.name?.split(' ')[0] || "Adel"}
            </h1>
            <p className="text-slate-600 dark:text-neutral-400 mt-1.5 text-xs sm:text-sm md:text-base font-normal">
              Orchestrate your professional impact and career logic.
            </p>
          </div>
          {/* Quick jump to editor button for easy mobile and tablet access */}
          <Link
            href="/editor"
            className="md:hidden inline-flex items-center justify-center gap-2 w-full sm:w-auto py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>Open Resume Editor</span>
            <ChevronRight className="w-4 h-4 ml-auto sm:ml-0" />
          </Link>
        </header>

        {/* Pixel Graphics Canvas Container hosting the ENTIRE dashboard cards */}
        <DashboardPixelBanner>
          <SmartUpdateCenter
            initialSuggestions={dbUser.suggestions}
            lastSyncAt={dbUser.githubData?.lastSyncedAt?.toISOString() || null}
            accessToken={session?.user ? (session.user as any).accessToken : null}
            topSlot={
              <ATSScoreCard
                storedScore={mainVersion?.atsScore ?? 0}
                versionId={mainVersion?.id}
                resumeName={mainResume?.name || "My Professional Resume"}
                versionName={mainVersion?.versionName || "Main"}
              />
            }
            rightSlot={
            <>
              {/* Quick Operations */}
              <div className="p-6 md:p-7 rounded-2xl bg-white dark:bg-[#141417] border border-[#E5E5E5] dark:border-[#27272a] shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-2xl transition-colors duration-200">
                <h3 className="text-sm font-bold text-[#171717] dark:text-[#f2efe9] mb-4">
                  Quick Operations
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/editor"
                    className="group flex items-center justify-between p-3.5 bg-[#F5F5F3] dark:bg-[#18181b] rounded-xl border border-[#E5E5E5] dark:border-[#27272a] text-[#171717] dark:text-[#f2efe9] hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-[#0099ff] group-hover:scale-105 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#171717] dark:text-[#f2efe9]">Resume Editor</span>
                        <span className="text-[11px] text-slate-600 dark:text-neutral-400">
                          Update your master CV
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-[#0099ff] group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <Link
                    href="/dashboard/syncing"
                    className="group flex items-center justify-between p-3.5 bg-[#F5F5F3] dark:bg-[#18181b] rounded-xl border border-[#E5E5E5] dark:border-[#27272a] text-[#171717] dark:text-[#f2efe9] hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-[#0099ff] group-hover:scale-105 transition-transform">
                        <LayoutGrid className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#171717] dark:text-[#f2efe9]">Import from GitHub</span>
                        <span className="text-[11px] text-slate-600 dark:text-neutral-400">
                          Sync your repositories
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-[#0099ff] group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  {isSystemAdmin && (
                    <Link
                      href="/admin"
                      className="group flex items-center justify-between p-3.5 bg-[#F5F5F3] dark:bg-[#18181b] rounded-xl border border-[#E5E5E5] dark:border-[#27272a] text-[#171717] dark:text-[#f2efe9] hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#171717] dark:text-[#f2efe9]">Admin Console</span>
                          <span className="text-[11px] text-slate-600 dark:text-neutral-400">
                            Broadcasts &amp; Registry
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-neutral-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Resummit Pro Banner */}
              <div className="p-6 md:p-7 rounded-2xl bg-neutral-900 border border-neutral-800 text-white shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider rounded-md">PRO</span>
                  <h3 className="font-bold text-base text-white">Resummit Pro</h3>
                  <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 text-[10px] font-medium rounded-md ml-auto">Coming Soon</span>
                </div>
                <p className="text-neutral-300 text-xs mb-5 leading-relaxed">
                  Unlock real-time ATS monitoring and multi-version resume management.
                </p>
                <button
                  disabled
                  className="w-full py-2.5 bg-neutral-800/80 border border-neutral-700/60 text-neutral-400 font-medium rounded-xl text-xs cursor-not-allowed select-none transition-colors"
                >
                  Coming Soon
                </button>
              </div>

              {/* Sign Out Button */}
              <div className="pt-1">
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    type="submit"
                    className="block w-full py-2.5 text-center text-red-500 hover:text-red-600 text-xs font-bold transition-all border border-red-200 dark:border-red-900/40 rounded-xl cursor-pointer bg-white dark:bg-[#141417] hover:bg-red-50 dark:hover:bg-red-950/20 shadow-xs"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </>
          }
        />
        </DashboardPixelBanner>
      </main>
    </div>
  );
}
