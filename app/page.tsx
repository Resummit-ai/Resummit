import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sparkles, GitBranch, ArrowRight, CheckCircle2, Zap, Target } from "lucide-react";
import Link from "next/link";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden selection:bg-blue-500/30">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Sclade</span>
        </div>
        <Link 
          href="/login" 
          className="text-sm font-medium hover:text-blue-400 transition-colors"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 md:pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-medium mb-8 animate-fade-in">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          The Auto-Updating AI CV Engine
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
          Your CV should be <br /> as <span className="text-blue-500">active</span> as your GitHub.
        </h1>
        
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Sclade connects to your repositories, detects your biggest impacts, and generates ATS-optimized resume bullets using Gemini AI. 🚀
          Stop writing, start syncing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/20 active:scale-95"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 border border-neutral-800">
            <GitBranch className="w-5 h-5" />
            View Demo
          </button>
        </div>

        {/* Hero Visual Block */}
        <div className="mt-24 relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative glass rounded-3xl p-4 md:p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-[10px] text-neutral-600 font-mono uppercase tracking-[0.2em]">Sync Status: Active</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-64 rounded-xl bg-neutral-950 p-6 text-left border border-white/5">
                      <div className="flex items-center gap-2 text-blue-400 mb-4">
                        <GitBranch className="w-4 h-4" />
                        <span className="text-xs font-bold font-mono">github_repo_scan</span>
                      </div>
                      <div className="space-y-3 opacity-50">
                        <div className="w-[80%] h-2 bg-neutral-800 rounded" />
                        <div className="w-[60%] h-2 bg-neutral-800 rounded" />
                        <div className="w-[90%] h-10 bg-blue-950/20 border border-blue-500/20 rounded-lg flex items-center px-4">
                          <span className="text-[10px] text-blue-400">Analysis complete... 15 repos found</span>
                        </div>
                      </div>
                  </div>
                  <div className="h-64 rounded-xl bg-white p-6 text-left border border-white/5 flex flex-col">
                      <div className="flex items-center gap-2 text-black mb-4">
                        <Target className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">ATS PREVIEW</span>
                      </div>
                      <div className="space-y-3">
                        <div className="w-[100%] h-3 bg-neutral-200 rounded" />
                        <div className="w-[100%] h-2 bg-neutral-100 rounded" />
                        <div className="w-[100%] h-2 bg-neutral-100 rounded" />
                        <div className="w-[100%] h-2 bg-neutral-100 rounded" />
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "GitHub Native",
              desc: "Deep integration with your commit history and project metadata.",
              icon: <GitBranch className="w-6 h-6 text-blue-400" />
            },
            {
              title: "ATS-Optimized",
              desc: "Engineered specifically to beat parsing algorithms used by top tech firms.",
              icon: <Target className="w-6 h-6 text-sky-400" />
            },
            {
              title: "Gemini Intelligence",
              desc: "Leveraging state-of-the-art AI to write bullets that sound like you.",
              icon: <Sparkles className="w-6 h-6 text-blue-500" />
            }
          ].map((f, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-neutral-500 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-900 text-center text-neutral-600 text-sm">
        <p>© 2026 Sclade AI. Built for the future of work.</p>
      </footer>
    </div>
  );
}
