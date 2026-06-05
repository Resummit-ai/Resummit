import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options",        value: "SAMEORIGIN" },
  // Prevent MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Tighten referrer to same-origin only
  { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
  // Disable unnecessary browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Basic XSS protection for older browsers
  { key: "X-XSS-Protection",       value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  // Keep all Node.js-only packages out of the Edge runtime bundle.
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "pg",
    "@prisma/adapter-pg",
  ],

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "resummit-ai.vercel.app",
          },
        ],
        destination: "https://resummit.vercel.app/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // Apply security headers to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
