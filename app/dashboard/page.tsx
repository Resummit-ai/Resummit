import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/server/prisma";
import { redirect } from "next/navigation";
import { LayoutDashboard, FileText, Settings, Rocket, ArrowRight, Bell, User } from "lucide-react";
import Link from "next/link";
import { SmartUpdateCenter } from "@/components/dashboard/SmartUpdateCenter";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Load user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      suggestions: {
        where: { status: "PENDING" },
        orderBy: { priority: "desc" },
      },
      cv: true,
    }
  });

  // If user not in DB (fresh DB / new deploy), auto-create from session to avoid redirect loop
  let dbUser = user;
  if (!dbUser) {
    dbUser = await prisma.user.upsert({
      where: { id: session.user.id },
      update: {},
      create: {
        id: session.user.id,
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
      },
      include: {
        suggestions: {
          where: { status: "PENDING" },
          orderBy: { priority: "desc" },
        },
        cv: true,
      },
    });
  }

  // Check if onboarding is needed (no projects AND no CV)
  const projectCount = await prisma.project.count({ where: { userId: dbUser.id } });
  const showOnboarding = projectCount === 0 && !dbUser.cv;

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 font-outfit">
         <div className="max-w-md text-center">
            <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/10">
              <Rocket className="text-blue-500 w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight uppercase">Intelligence Required</h1>
            <p className="text-neutral-500 mb-10 leading-relaxed font-light">Your career engine is offline. Connect your GitHub repositories to initialize the semantic audit.</p>
            <Link 
              href="/dashboard/syncing"
              className="group block w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                Initialize GitHub Syncing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-blue-500/30">
      {/* Premium Gradient Header Background */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-600/[0.03] to-transparent pointer-events-none" />

      {/* Top Nav */}
      <nav className="relative z-50 px-8 py-5 flex items-center justify-between border-b border-white/[0.03] bg-neutral-950/80 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight font-outfit">SCLADE</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium uppercase tracking-widest text-neutral-500">
             <Link href="/dashboard" className="text-white border-b-2 border-blue-500 pb-1 -mb-[22px]">Command Center</Link>
             <Link href="/editor" className="hover:text-white transition-colors">Editor</Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <button className="text-neutral-500 hover:text-white transition-colors"><Bell className="w-5 h-5" /></button>
           <button className="text-neutral-500 hover:text-white transition-colors"><Settings className="w-5 h-5" /></button>
           <div className="h-8 w-[1px] bg-white/10 mx-2" />
           <div className="flex items-center gap-3 pl-2">
             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/5 flex items-center justify-center">
               <User className="w-5 h-5 text-neutral-400" />
             </div>
           </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto p-8 md:p-12">
        <header className="mb-12">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] uppercase font-bold tracking-widest mb-4">
             System Active • Gemini-2.0
           </div>
           <h1 className="text-4xl font-bold tracking-tight font-outfit flex items-center gap-4">
             Command Center
           </h1>
           <p className="text-neutral-500 mt-2 font-light text-lg">Orchestrate your professional impact and career logic.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* Left/Middle Column - Suggestions & Activity */}
           <div className="lg:col-span-8 space-y-10">
              <SmartUpdateCenter 
                initialSuggestions={(dbUser.suggestions || []).map((s: any) => ({
                  id: s.id,
                  type: s.type,
                  title: s.title,
                  description: s.description,
                  proposedData: s.proposedData,
                  currentData: s.currentData,
                  confidence: s.confidence,
                  priority: s.priority
                }))} 
                lastSyncAt={dbUser.lastSyncAt?.toISOString() || null}
                accessToken={(session.user as any).accessToken as string | undefined}
              />
           </div>

           {/* Right Column - Stats & Links */}
           <div className="lg:col-span-4 space-y-8">
              <div className="glass-panel p-8 rounded-[2.5rem] bg-neutral-900/40 border border-white/[0.05]">
                 <h3 className="text-[11px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6">Quick Operations</h3>
                 <div className="space-y-4">
                    <Link href="/editor" className="group flex items-center justify-between p-5 bg-neutral-900/60 rounded-3xl border border-white/[0.03] hover:border-blue-500/30 hover:bg-neutral-800/80 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold uppercase tracking-wide">Elite Editor</span>
                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Update 2m ago</span>
                          </div>
                       </div>
                       <ArrowRight className="w-4 h-4 text-neutral-700 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/dashboard/syncing" className="group flex items-center justify-between p-5 bg-neutral-900/60 rounded-3xl border border-white/[0.03] hover:border-violet-500/30 hover:bg-neutral-800/80 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                            <LayoutDashboard className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold uppercase tracking-wide">Force Re-sync</span>
                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">6 repositories cached</span>
                          </div>
                       </div>
                       <ArrowRight className="w-4 h-4 text-neutral-700 group-hover:translate-x-1 transition-transform" />
                    </Link>
                 </div>
              </div>

              <div className="relative overflow-hidden group p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl shadow-blue-500/20">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all" />
                 <h3 className="font-bold text-2xl mb-2 font-outfit">Sclade Pro</h3>
                 <p className="text-blue-100 text-sm mb-8 leading-relaxed opacity-80">Unlock real-time commit monitoring and deep-agentic bullet generation for high-tier roles.</p>
                 <button className="w-full py-4 bg-white text-blue-700 font-bold rounded-2xl text-sm hover:translate-y-[-2px] transition-all shadow-xl active:scale-95">
                    Elevate Engine
                 </button>
              </div>
           </div>

        </div>
      </main>
    </div>
  );
}
