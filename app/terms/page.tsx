import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Resummit",
  description: "Read the terms and conditions for using Resummit's developer resume generation platforms.",
};

export default function TermsPage() {
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
            Last Updated: May 31, 2026
          </span>
        </div>

        {/* Header Block */}
        <div className="relative mb-12 p-8 rounded-2xl border border-[var(--sclade-card-border)] bg-[var(--sclade-card-bg)] overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[var(--sclade-text-primary)] mb-4 font-display">
            Terms of Service
          </h1>
          <p className="text-lg text-[var(--sclade-text-secondary)] leading-relaxed">
            Welcome to Resummit. By accessing or using our developer-centric CV builder, you agree to comply with and be bound by the following terms.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 text-[var(--sclade-text-secondary)] leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--sclade-text-primary)]">1. Acceptance of Terms</h2>
            <p>
              By signing in to Resummit via GitHub or Google, you accept these terms of service and agree to use our workspace in accordance with all applicable local, national, and international laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--sclade-text-primary)]">2. User Accounts & Licensing</h2>
            <p>
              To use the full capabilities of Resummit, you must authenticate through a third-party social provider (specifically GitHub).
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for keeping your GitHub account keys and login sessions secure.</li>
              <li>We do not write to or modify your public repositories. We only read metadata to assist you in compiling your work.</li>
              <li>You represent that all details, contributions, work achievements, and project lists included in your resume are accurate and true.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--sclade-text-primary)]">3. Intellectual Property</h2>
            <p>
              You own all intellectual property rights to the resumes you generate, edit, compile, and download through Resummit. Resummit retains all rights, titles, and interests in the underlying editor software, styles, scoring engines, designs, and templates.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--sclade-text-primary)]">4. Permitted & Prohibited Uses</h2>
            <p>
              You may use Resummit strictly to create, compile, tailoring, and export your personal professional portfolios. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the resume generation services to generate spam, malicious, or deceptive profiles.</li>
              <li>Attempt to scrape, reverse-engineer, or disrupt the ATS scoring and rating engine parameters.</li>
              <li>DDoS or bypass the rate-limits of our background repository synchronization processes.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--sclade-text-primary)]">5. Disclaimer of Warranties</h2>
            <p>
              Resummit is provided "as is" and "as available". We do not guarantee that using our resume evaluations, bullet refinement suggestions, or ATS scores will guarantee employment, interview invitations, or particular hiring results.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[var(--sclade-text-primary)]">6. Service Modifications</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any aspect of Resummit at any time. We will notify users of any substantial updates or changes through our platform logs or via email.
            </p>
          </section>

          <section className="space-y-4 border-t border-[var(--sclade-card-border)] pt-8">
            <h2 className="text-xl font-bold text-[var(--sclade-text-primary)]">Questions or Feedback?</h2>
            <p>
              If you have any questions, bug reports, or legal inquiries regarding these terms, please open an issue or reach out:
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
