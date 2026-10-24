import type { Metadata } from "next";
import Script from "next/script";
import { AuthProvider } from "@/components/providers/auth-provider";
import { PostHogProvider, PageViewTracker } from "@/components/providers/posthog-provider";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";

import { Inter, Geist_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

import { LANDING_CONFIG } from "@/lib/landing-config";

const BASE_URL = "https://resummit.vercel.app";

export const metadata: Metadata = {
  title: "Resummit – AI Resume Builder from GitHub | ATS-Friendly CV",
  description: "Connect GitHub and get an ATS-friendly resume from your real projects. Paste a job description to tailor it in seconds. Free to start.",
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
    title: "Resummit – AI Resume Builder from GitHub | ATS-Friendly CV",
    description: "Connect GitHub and get an ATS-friendly resume from your real projects. Paste a job description to tailor it in seconds. Free to start.",
    url: BASE_URL,
    siteName: "Resummit",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Resummit – AI Resume Builder from GitHub" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resummit – AI Resume Builder from GitHub | ATS-Friendly CV",
    description: "Connect GitHub and get an ATS-friendly resume from your real projects. Paste a job description to tailor it in seconds. Free to start.",
    images: ["/og.png"],
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  category: "technology",
};

const softwareApplicationData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Resummit",
  url: BASE_URL,
  description: "Connect GitHub and get an ATS-friendly resume from your real projects. Paste a job description to tailor it in seconds. Free to start.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Adel Muhammed", url: "https://github.com/dragon486" },
};

const faqPageData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LANDING_CONFIG.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
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
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNameStructuredData) }} />
        <Script id="theme-loader" strategy="beforeInteractive">
          {`try{const t=localStorage.getItem('sclade-theme');if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.classList.remove('light')}else{document.documentElement.classList.add('light');document.documentElement.classList.remove('dark')}}catch(_){}`}
        </Script>
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
