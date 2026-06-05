import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/server/prisma";
import { encryptToken } from "@/lib/server/crypto";
import { logger } from "@/lib/server/logger";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (!user.email) {
        logger.auth("denied.no_email", { provider: account?.provider });
        return false;
      }

      try {
        const githubUsername =
          account?.provider === "github" ? (profile as any)?.login : null;

        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            image: user.image,
            ...(githubUsername ? { githubUsername } : {}),
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            ...(githubUsername ? { githubUsername } : {}),
          },
        });

        // Single authoritative save of the GitHub token — encrypted at rest.
        // The jwt callback and events are NOT allowed to duplicate this.
        if (account?.provider === "github" && account.access_token) {
          const encrypted = encryptToken(account.access_token);
          await prisma.gitHubData.upsert({
            where: { userId: dbUser.id },
            update: { accessToken: encrypted },
            create: {
              userId: dbUser.id,
              accessToken: encrypted,
              repositories: [],
              signals: {},
            },
          });
          logger.auth("token_saved", { userId: dbUser.id, provider: "github" });
        }
      } catch (error) {
        logger.error("auth.signIn", error);
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // Store the raw (in-memory) access token in the JWT so API routes can
      // use it directly without a DB round-trip. This is ONLY available on the
      // initial sign-in request (when `account` is present).
      if (account?.provider === "github" && account.access_token) {
        token.accessToken = account.access_token;
      }

      // Resolve the CUID-based database ID — only on initial login or when
      // the token is missing it. After first login this branch is skipped.
      if (user || !token.id?.toString().startsWith("c")) {
        const email = user?.email || (token.email as string | undefined);
        if (email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email },
              select: { id: true, githubUsername: true },
            });
            if (dbUser) {
              token.id = dbUser.id;
              token.githubUsername = dbUser.githubUsername;
            }
          } catch (err) {
            logger.error("auth.jwt.db_lookup", err);
          }
        }
      }

      return token;
    },
  },
  // Events deliberately left empty: signIn callback handles everything.
  // Duplicate token writes in events were removed to prevent N+1 DB calls.
  events: {},
});
