import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep all Node.js-only packages out of the Edge runtime bundle.
  // better-sqlite3 uses native bindings (fs, path) that are unavailable in Edge.
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "better-sqlite3",
    "@prisma/adapter-better-sqlite3",
  ],
};

export default nextConfig;
