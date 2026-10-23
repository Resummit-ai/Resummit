"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./Icons";

export function FeedbackSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, rating, message }),
      });
      if (res.ok) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setErrorMsg("Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="feedback"
      className="scroll-mt-12 bg-[#F5F5F3] dark:bg-[#09090b] text-[#171717] dark:text-white py-24 sm:py-32 border-t border-[#E5E5E5] dark:border-neutral-900 transition-colors duration-300"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-3xl border border-[#E5E5E5] dark:border-neutral-800 bg-white dark:bg-[#101014] p-8 sm:p-14 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-2xl transition-colors duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Statement & Creator Details */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-4xl sm:text-5xl font-extrabold sm:font-bold tracking-tight text-[#171717] dark:text-white leading-[1.12]">
                Built from your work. Not from templates.
              </h2>
              <p className="text-base text-[#707070] dark:text-neutral-400 leading-relaxed">
                Resummit turns real engineering work into professional resumes developers can confidently share with recruiters and hiring teams. Designed, developed, and maintained by{" "}
                <span className="font-semibold text-[#171717] dark:text-white">Adel Muhammed</span>.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="mailto:contact@resummit.app"
                  className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] dark:border-neutral-800 bg-[#F7F7F6] dark:bg-[#16161c] px-4 py-2 text-xs font-semibold text-[#171717] dark:text-neutral-300 hover:text-blue-600 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Contact Email</span>
                </a>
                <a
                  href="https://github.com/dragon486/Resummit"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] dark:border-neutral-800 bg-[#F7F7F6] dark:bg-[#16161c] px-4 py-2 text-xs font-semibold text-[#171717] dark:text-neutral-300 hover:text-blue-600 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                  <span>GitHub Profile</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/adel-muhammed-71328a2b5"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] dark:border-neutral-800 bg-[#F7F7F6] dark:bg-[#16161c] px-4 py-2 text-xs font-semibold text-[#171717] dark:text-neutral-300 hover:text-blue-600 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
                >
                  <LinkedinIcon className="h-3.5 w-3.5" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>

            {/* Right: Working Interactive Feedback Form */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#E5E5E5] dark:border-neutral-800/80 bg-[#F7F7F6] dark:bg-[#141419] p-6 sm:p-8 space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-[#171717] dark:text-white">Share Your Feedback</h3>
                  <p className="mt-1 text-xs text-[#707070] dark:text-neutral-400">
                    Help us improve Resummit. We read every message.
                  </p>
                </div>

                {submitted ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <p className="font-semibold text-[#171717] dark:text-white text-sm">Thank you for your feedback!</p>
                    <p className="text-xs text-[#707070] dark:text-neutral-400">Your comments help shape the future of Resummit.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono text-[#707070] dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Rivera"
                        className="w-full rounded-xl border border-[#E5E5E5] dark:border-neutral-800 bg-white dark:bg-[#0c0c0f] px-3.5 py-2.5 text-xs text-[#171717] dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#707070] dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. alex@example.com"
                        className="w-full rounded-xl border border-[#E5E5E5] dark:border-neutral-800 bg-white dark:bg-[#0c0c0f] px-3.5 py-2.5 text-xs text-[#171717] dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#707070] dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                        Rating
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                              rating === star
                                ? "bg-blue-600 text-white shadow-sm"
                                : "border border-[#E5E5E5] dark:border-neutral-800 bg-white dark:bg-[#0c0c0f] text-[#707070] dark:text-neutral-400 hover:text-black dark:hover:text-white"
                            }`}
                          >
                            {star}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#707070] dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                        Your Message
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="What features do you love? What should we build next?"
                        className="w-full rounded-xl border border-[#E5E5E5] dark:border-neutral-800 bg-white dark:bg-[#0c0c0f] px-3.5 py-2.5 text-xs text-[#171717] dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-blue-500 focus:outline-none resize-none"
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-xs text-red-500">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-full bg-[#171717] dark:bg-white py-2.5 text-xs font-semibold text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{submitting ? "Submitting..." : "Submit Feedback"}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
