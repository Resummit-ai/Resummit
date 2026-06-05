import type { Metadata } from "next";
import { AuthProvider } from "@/components/providers/auth-provider";
import { PostHogProvider, PageViewTracker } from "@/components/providers/posthog-provider";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

const inter = { variable: 'font-sans' };
const outfit = { variable: 'font-display' };

const BASE_URL = "https://resummit.vercel.app";

export const metadata: Metadata = {
  title: "Resummit — Generate Your Resume from GitHub | Free AI Resume Builder",
  description: "Connect your GitHub and get a recruiter-ready resume built from your real projects in minutes. AI reads your repos, writes your bullets, exports a clean PDF. Free.",
  keywords: [
    "github resume builder",
    "generate resume from github",
    "ai resume builder for developers",
    "developer resume generator",
    "github to resume",
    "ats resume builder",
    "software engineer resume builder",
    "resummit",
  ],
  authors: [{ name: "Adel Muhammed", url: "https://github.com/dragon486" }],
  creator: "Adel Muhammed",
  metadataBase: new URL(BASE_URL),
  robots: { index: true, follow: true },
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "Resummit — Generate Your Resume from GitHub",
    description: "AI reads your GitHub repos and writes your resume bullets. Free to start.",
    url: BASE_URL,
    siteName: "Resummit",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Resummit" }],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resummit — Generate Your Resume from GitHub",
    description: "AI reads your repos and writes your resume. Free to start.",
    images: ["/og-image.png"],
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  category: "technology",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Resummit",
  url: BASE_URL,
  description: "AI-powered resume builder that reads your GitHub repositories and generates ATS-optimized resumes automatically.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Adel Muhammed", url: "https://github.com/dragon486" },
};

const siteNameStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Resummit",
  alternateName: ["Resummit AI", "Resummit App"],
  url: BASE_URL,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNameStructuredData) }} />
        <script dangerouslySetInnerHTML={{
          __html: `try{const t=localStorage.getItem('sclade-theme');if(t==='light'){document.documentElement.classList.add('light');document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light')}}catch(_){}`
        }} />
      </head>
      <body className="font-sans min-h-full bg-[var(--sclade-bg)] text-[var(--sclade-text-primary)] flex flex-col transition-colors duration-200">
        <PostHogProvider>
          <AuthProvider>{children}</AuthProvider>
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
