"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle2, GitBranch, Sparkles, Brain } from "lucide-react";

type SyncStep = "FETCHING" | "SELECTING" | "GENERATING" | "SAVING" | "COMPLETED" | "ERROR";

export default function SyncingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<SyncStep>("FETCHING");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    async function runSync() {
      try {
        // 1. Fetch Repos
        setStep("FETCHING");
        const fetchRes = await fetch("/api/sync/github");
        if (!fetchRes.ok) {
          const errData = await fetchRes.json().catch(() => ({}));
          throw new Error(errData.error || "GitHub fetch failed");
        }
        const repos = await fetchRes.json();

        // 2. Select Top Projects (Logic is already handled by API)
        setStep("SELECTING");
        const selectedProjects = repos; // Auto-select all from filtered payload

        // 3. Generate AI Bullets
        setStep("GENERATING");
        const aiRes = await fetch("/api/sync/ai", {
          method: "POST",
          body: JSON.stringify({ projects: selectedProjects }),
          headers: { "Content-Type": "application/json" },
        });
        if (!aiRes.ok) {
          const errData = await aiRes.json().catch(() => ({}));
          throw new Error(errData.error || "AI generation failed");
        }
        const aiData = await aiRes.json();
        
        // 4. Save to Database
        setStep("SAVING");
        const saveRes = await fetch("/api/sync/save", {
          method: "POST",
          body: JSON.stringify(aiData),
          headers: { "Content-Type": "application/json" },
        });
        if (!saveRes.ok) {
          const errData = await saveRes.json().catch(() => ({}));
          throw new Error(errData.error || "Saving failed");
        }

        setStep("COMPLETED");
        setTimeout(() => router.push("/editor"), 1000);
      } catch (err: any) {
        setStep("ERROR");
        setError(err.message || "An unexpected error occurred.");
      }
    }

    runSync();
  }, [session, router]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md">
        {/* Animated Progress Ring */}
        <div className="relative w-32 h-32 mx-auto mb-12">
          <div className="absolute inset-0 border-4 border-neutral-900 rounded-full" />
          <div className={`absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin ${step === "COMPLETED" || step === "ERROR" ? "hidden" : ""}`} />
          <div className="absolute inset-0 flex items-center justify-center">
            {step === "FETCHING" && <GitBranch className="w-10 h-10 text-neutral-400" />}
            {step === "SELECTING" && <Sparkles className="w-10 h-10 text-blue-400" />}
            {step === "GENERATING" && <Brain className="w-10 h-10 text-sky-400" />}
            {step === "SAVING" && <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />}
            {step === "COMPLETED" && <CheckCircle2 className="w-10 h-10 text-green-500" />}
            {step === "ERROR" && <div className="text-red-500 font-bold text-2xl">!</div>}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {step === "FETCHING" && "Connecting to GitHub..."}
          {step === "SELECTING" && "Picking your best work..."}
          {step === "GENERATING" && "AI is writing your resume..."}
          {step === "SAVING" && "Saving your progress..."}
          {step === "COMPLETED" && "Everything is ready!"}
          {step === "ERROR" && "Sync Failed"}
        </h2>

        <p className="text-neutral-500">
          {step === "FETCHING" && "Scrubbing repositories for high-impact data."}
          {step === "SELECTING" && "Analyzing stars and activity metrics."}
          {step === "GENERATING" && "Generating STAR-method bullets for ATS."}
          {step === "SAVING" && "Finalizing your professional sync."}
          {step === "COMPLETED" && "Redirecting to your editor..."}
          {step === "ERROR" && error}
        </p>

        {step === "ERROR" && (
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium transition-colors border border-neutral-800"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
