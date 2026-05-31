import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Resummit",
  description: "Learn how Resummit protects, secures, and handles your GitHub profile data and account privacy.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[var(--sclade-bg)] flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full">
        {/* Navigation / Header */}
        <div className="mb-12 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-semibold text-[var(--sclade-text-secondary)] hover:text-[var(--sclade-text-primary)] transition-colors"
          >
            ← Back to Home
          </Link>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--sclade-card-bg)] border border-[var(--sclade-card-border)] text-[var(--sclade-text-secondary)]">
            Effective Date: May 31, 2026
          </span>
        </div>

        {/* Header Block */}
        <div className="relative mb-12 p-8 rounded-2xl border border-[var(--sclade-card-border)] bg-[var(--sclade-card-bg)] overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[var(--sclade-text-primary)] mb-4 font-display">
            Privacy Policy
          </h1>
          <p className="text-lg text-[var(--sclade-text-secondary)] leading-relaxed">
            Your trust is vital to us. This Privacy Policy explains how Resummit collects, processes, and protects your information when you connect your GitHub account to generate resume contents.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-[var(--sclade-text-secondary)] leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--sclade-text-primary)]">1. Data We Collect</h2>
            <p>
              Resummit is designed to compile your professional achievements directly from your coding contributions. To do this, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>GitHub Profile Information:</strong> Public profile details (name, email address, username, avatar URL).</li>
              <li><strong>GitHub Metadata:</strong> Names, descriptions, languages, README documents, and public activity/commit frequencies of your repositories.</li>
              <li><strong>Resume Content:</strong> Any manual inputs, professional summaries, achievements, and customized layouts you create or edit in our workspace.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--sclade-text-primary)]">2. How We Use Your Data</h2>
            <p>
              We process your repository metadata strictly to generate and score your professional CV. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To construct high-signal resume bullets using our Gemini AI models.</li>
              <li>To evaluate skill distributions and generate verified skills badges based on actual languages detected in your codebase.</li>
              <li>To calculate ATS match scores and highlight potential weak spots in your profile metrics.</li>
            </ul>
            <p className="italic text-sm text-[var(--sclade-text-muted)]">
              We never sell, rent, or distribute your code, repositories, or personal information to third-party brokers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--sclade-text-primary)]">3. Authentication & Security</h2>
            <p>
              We authenticate you securely using Auth.js (NextAuth) and GitHub OAuth. 
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We only request read-level access to retrieve public metadata and repositories.</li>
              <li>Your encrypted authorization access tokens are stored securely in our private database strictly to run scheduled background synchronizations.</li>
              <li>You can revoke access tokens at any time directly through your GitHub settings panel under "Authorized OAuth Apps".</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--sclade-text-primary)]">4. Third-Party Integrations</h2>
            <p>
              We integrate with the following trusted third-party providers:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Gemini API:</strong> Processes raw highlights to generate structured and refined professional highlights.</li>
              <li><strong>Supabase / Neon:</strong> Stores encrypted user profiles and active resume states securely.</li>
              <li><strong>Vercel:</strong> Hosts our application backend and performance analytics.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--sclade-text-primary)]">5. Your Rights & Data Deletion</h2>
            <p>
              You own your data. You can download your saved CVs as ATS-scannable PDFs at any time. If you wish to delete your Resummit account and permanently purge all associated data, you can request full account deletion by contacting us at our support address.
            </p>
          </section>

          <section className="space-y-4 border-t border-[var(--sclade-card-border)] pt-8">
            <h2 className="text-xl font-bold text-[var(--sclade-text-primary)]">Contact Us</h2>
            <p>
              If you have any questions or feedback regarding this policy, please reach out to us:
            </p>
            <ul className="space-y-2">
              <li>📧 Support Email: <a href="mailto:adelmuhammed786@gmail.com" className="text-blue-500 hover:underline">adelmuhammed786@gmail.com</a></li>
              <li>🛠️ Support Dashboard: <a href="https://github.com/Resummit-ai/Sclade/issues" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Resummit GitHub Issues</a></li>
            </ul>
          </section>
        </div>
      </div>

      <footer className="mt-16 border-t border-[var(--sclade-card-border)] pt-8 text-center text-xs text-[var(--sclade-text-muted)]">
        &copy; {new Date().getFullYear()} Resummit.ai. All rights reserved.
      </footer>
    </main>
  );
}
