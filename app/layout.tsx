import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Added Outfit
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "Sclade AI | Auto-Updating AI CV Engine",
  description: "Transform your GitHub projects into professional, ATS-optimized resume bullets in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body className="font-sans min-h-full bg-neutral-950 text-white flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
