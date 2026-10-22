import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authConfig = {
  // trustHost lets NextAuth work correctly behind Vercel's proxy and
  // across preview deployments without "Invalid redirect_uri" errors.
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || (process.env.VERCEL_ENV === "preview" ? "resummit-preview-secret-key-32chars-min" : undefined),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID || process.env.GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET || process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email public_repo",
        },
      },
    }),
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
  ],
  // jwt/session callbacks are defined in auth.ts — NOT here.
  // Defining them in both places causes them to conflict.
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
