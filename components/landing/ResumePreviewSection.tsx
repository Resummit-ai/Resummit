"use client";

import React from "react";
import { Cpu, FileCheck, Check, ArrowRight } from "lucide-react";

export function ResumePreviewSection() {
  return (
    <section id="interactive-resume" className="scroll-mt-16 bg-[#09090b] text-white py-24 sm:py-32 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Rendered Single-Page Resume of Alex Developer (Matches Screenshot 1) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-neutral-800 bg-[#fbfbfb] text-neutral-900 shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-6 sm:p-9 font-serif text-[11px] leading-relaxed select-text">
              {/* Header */}
              <div className="text-center pb-3 border-b-[1.5px] border-neutral-900">
                <h3 className="text-xl sm:text-2xl font-bold tracking-wider text-neutral-950 uppercase font-serif">
                  ALEX DEVELOPER
                </h3>
                <p className="mt-1 text-[10.5px] text-neutral-700">
                  Jalandhar, Punjab, India (Open to Remote) · alex.developer@email.com · +91 98765 43210 ·{" "}
                  <span className="text-blue-700 underline cursor-pointer">github.com/alex-dev</span> ·{" "}
                  <span className="text-blue-700 underline cursor-pointer">linkedin.com/in/alex-developer</span>
                </p>
              </div>

              {/* Technical Summary */}
              <div className="mt-3.5">
                <div className="text-[11.5px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-900 pb-0.5 mb-1.5 font-serif">
                  TECHNICAL SUMMARY
                </div>
                <p className="text-[10.5px] text-neutral-800 leading-normal">
                  Innovative Full Stack Software Engineer expert in building high throughput distributed systems and AI capabilities. Proficient in Python, JavaScript, and TypeScript with deep hands-on expertise in Next.js, Node.js, Flask, Prisma, and AWS. Adept at transforming complex data streams and model inference into clean, production-grade applications that drive business value.
                </p>
              </div>

              {/* Technical Skills */}
              <div className="mt-3.5">
                <div className="text-[11.5px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-900 pb-0.5 mb-1.5 font-serif">
                  TECHNICAL SKILLS
                </div>
                <div className="text-[10.5px] text-neutral-800 space-y-0.5">
                  <p><strong>Languages:</strong> Python, JavaScript, TypeScript</p>
                  <p><strong>Frameworks:</strong> Next.js, Node.js, React, Express, Flask, Django</p>
                  <p><strong>Tools & Platforms:</strong> AWS, PostgreSQL, Git, Docker, TensorFlow, OpenCV, Prisma, Redis, MongoDB, Jupyter, Slack, Bolt.io</p>
                </div>
              </div>

              {/* Professional Experience */}
              <div className="mt-3.5">
                <div className="text-[11.5px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-900 pb-0.5 mb-1.5 font-serif">
                  PROFESSIONAL EXPERIENCE
                </div>
                
                {/* Job 1 */}
                <div className="mb-2">
                  <div className="flex justify-between items-baseline font-bold text-[11px] text-neutral-950">
                    <span>Software &amp; AI Engineer Intern</span>
                    <span className="font-sans font-medium text-[10px] text-neutral-700">Mar 2026 — Present</span>
                  </div>
                  <div className="text-[10px] italic text-neutral-600 mb-1">AI Innovation Labs (Remote)</div>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[10.5px] text-neutral-800">
                    <li>Designed AI-powered customer support chatbot systems using Python and TensorFlow, increasing support ticket resolution efficiency by 34%.</li>
                    <li>Implemented classification algorithms in Python for predictive modeling of user engagement patterns, yielding a 12% boost in retention.</li>
                    <li>Automated functional QA scripts using Selenium WebDriver, cutting regression test duration by 60%.</li>
                  </ul>
                </div>

                {/* Job 2 */}
                <div>
                  <div className="flex justify-between items-baseline font-bold text-[11px] text-neutral-950">
                    <span>Junior Software Engineer</span>
                    <span className="font-sans font-medium text-[10px] text-neutral-700">Jun 2025 — Aug 2025</span>
                  </div>
                  <div className="text-[10px] italic text-neutral-600 mb-1">Grow AI Solutions</div>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[10.5px] text-neutral-800">
                    <li>Engineered and scaled a Node.js/Express backend serving 15,000+ active concurrent users with 99.9% uptime, reducing server response latency by 28%.</li>
                    <li>Built and documented a high-performance RESTful Django API for microservices, increasing data sync speeds by 40%.</li>
                    <li>Integrated automated integration tests using Pytest and Behave, boosting pipeline code coverage to 92%.</li>
                  </ul>
                </div>
              </div>

              {/* Technical Projects */}
              <div className="mt-3.5">
                <div className="text-[11.5px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-900 pb-0.5 mb-1.5 font-serif">
                  TECHNICAL PROJECTS
                </div>

                {/* Project 1 */}
                <div className="mb-2">
                  <div className="flex justify-between items-baseline font-bold text-[11px] text-neutral-950">
                    <span>Nexio</span>
                    <span className="font-sans font-medium text-[10px] text-neutral-700">Python, TensorFlow</span>
                  </div>
                  <p className="text-[10px] text-neutral-600 italic">
                    Nexio is a high-density, multi-tenant AI ecosystem designed for hyper-growth sales teams, combining professional CRM capabilities with a distributed Neural Persona engine.
                  </p>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[10.5px] text-neutral-800 mt-0.5">
                    <li>Automated intent scoring using TensorFlow and asynchronous workers results in sub 500ms response times for lead intake.</li>
                    <li>Distributed idempotency ensured through Redis-backed locking and atomic MongoDB logic, preventing re-execution during retry storms.</li>
                  </ul>
                </div>

                {/* Project 2 */}
                <div>
                  <div className="flex justify-between items-baseline font-bold text-[11px] text-neutral-950">
                    <span>Biliq</span>
                    <span className="font-sans font-medium text-[10px] text-neutral-700">Next.js, Prisma</span>
                  </div>
                  <p className="text-[10px] text-neutral-600 italic">
                    Biliq is an intelligent, hardware-free POS and digital billing platform that sends instant receipts via WhatsApp, manages kitchen workflows with a real-time KDS, and uses transaction data for automated customer marketing.
                  </p>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[10.5px] text-neutral-800 mt-0.5">
                    <li>Utilizes Prisma ORM to manage database schema and Next.js App Router for server-side rendering, enabling seamless integration of real-time analytics with the POS system.</li>
                    <li>Leverages Server-Sent Events (SSE) to deliver instant receipts via WhatsApp without requiring app installs, improving customer satisfaction and reducing support queries.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Micro-Features (Matches Screenshot 1) */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-500 mb-3">
                INTERACTIVE OUTPUT
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-5">
                Recruiter-Ready.<br />
                ATS-Optimized.
              </h2>
              <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-normal">
                Here is a real resume generated from developer commits. It uses professional formatting, clean sections, and is fully optimized for Applicant Tracking Systems (ATS).
              </p>
            </div>

            {/* Feature Item 1 */}
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <Cpu size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">AI Bullets Generation</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Parses your GitHub commits to write structured, accomplishment-focused resume points automatically.
                </p>
              </div>
            </div>

            {/* Feature Item 2 */}
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <FileCheck size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">ATS Parser Certified</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Conforms strictly to single-page PDF structures, typography limits, and machine-readable content rules.
                </p>
              </div>
            </div>

            {/* Live ATS Scorecard Badge */}
            <div className="rounded-xl border border-neutral-800 bg-[#121318] p-5 flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-400 font-medium">ATS Compliance Score</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">98% Match Rate</div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Greenhouse · Lever · Workday
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
