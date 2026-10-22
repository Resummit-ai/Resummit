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
        setStep("FETCHING");
        
        // We use the new consolidated scan API
        const response = await fetch("/api/sync/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: (session?.user as any)?.accessToken })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Sync failed at engine level");
        }

        const data = await response.json();
        
        if (data.skipped) {
          setStep("COMPLETED"); // Already synced recently
        } else {
          setStep("COMPLETED");
        }

        setTimeout(() => router.push("/dashboard"), 1500);
      } catch (err: any) {
        setStep("ERROR");
        setError(err.message || "An unexpected error occurred during synchronization.");
      }
    }

    runSync();
  }, [session, router]);

  return (
    <div className="min-h-screen bg-[var(--sclade-bg)] flex flex-col items-center justify-center p-6 text-center font-outfit text-[var(--sclade-text-primary)]">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] shadow-sm">
        {/* Animated Progress Ring */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-[var(--sclade-border)] rounded-full" />
          <div className={`absolute inset-0 border-4 border-[var(--sclade-primary)] rounded-full border-t-transparent animate-spin ${step === "COMPLETED" || step === "ERROR" ? "hidden" : ""}`} />
          <div className="absolute inset-0 flex items-center justify-center">
            {step === "FETCHING" && <GitBranch className="w-8 h-8 text-[var(--sclade-text-muted)]" />}
            {step === "SELECTING" && <Sparkles className="w-8 h-8 text-[var(--sclade-primary)]" />}
            {step === "GENERATING" && <Brain className="w-8 h-8 text-[var(--sclade-primary)]" />}
            {step === "SAVING" && <Loader2 className="w-8 h-8 text-[var(--sclade-primary)] animate-spin" />}
            {step === "COMPLETED" && <CheckCircle2 className="w-8 h-8 text-[var(--sclade-success-text,#32704F)]" />}
            {step === "ERROR" && <div className="text-red-500 font-bold text-2xl">!</div>}
          </div>
        </div>

        <h2 className="text-xl font-bold text-[var(--sclade-text-primary)] mb-2">
          {step === "FETCHING" && "Connecting to GitHub..."}
          {step === "SELECTING" && "Picking your best work..."}
          {step === "GENERATING" && "AI is writing your resume..."}
          {step === "SAVING" && "Saving your resume..."}
          {step === "COMPLETED" && "Everything is ready!"}
          {step === "ERROR" && "Sync Failed"}
        </h2>

        <p className="text-[var(--sclade-text-secondary)] text-sm leading-relaxed">
          {step === "FETCHING" && "Scrubbing repositories for technical data."}
          {step === "SELECTING" && "Analyzing stars and activity metrics."}
          {step === "GENERATING" && "Generating STAR-method bullets for ATS."}
          {step === "SAVING" && "Finalizing your resume sync."}
          {step === "COMPLETED" && "Redirecting to your editor..."}
          {step === "ERROR" && error}
        </p>

        {step === "ERROR" && (
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-5 py-2.5 bg-[var(--sclade-primary)] hover:bg-[#4261C0] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
