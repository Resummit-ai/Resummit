import { signIn } from "@/auth";
import { GitBranch, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6 text-center">
        {/* Logo Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-400 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/20">
          <Sparkles className="text-white w-8 h-8" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Sclade <span className="text-blue-400">AI</span>
        </h1>
        <p className="text-neutral-400 text-lg mb-12">
          Transform your GitHub projects into professional, ATS-optimized resume bullets in seconds.
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-100 text-neutral-950 font-semibold py-4 px-6 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-xl"
          >
            <GitBranch className="w-5 h-5" />
            Continue with GitHub
          </button>
        </form>

        <p className="mt-8 text-neutral-500 text-sm">
          No credit card required. Free early access.
        </p>
      </div>

      {/* Subtle Bottom Decoration */}
      <div className="absolute bottom-8 text-neutral-600 text-[10px] uppercase tracking-[0.2em] font-medium">
        Designed for High-Impact Engineers
      </div>
    </div>
  );
}
