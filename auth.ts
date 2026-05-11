import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/server/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        // Automatically create/sync user in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              id: user.id, // Use provider ID to avoid mismatch with token.sub
              email: user.email,
              name: user.name,
            },
          });
          console.log(`[AUTH] Created database record for ${user.email}`);
        }
      } catch (error) {
        console.error("[AUTH] Database sync error during sign-in:", error);
      }
      return true;
    },
  },
});
