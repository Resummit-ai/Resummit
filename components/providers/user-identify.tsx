"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

interface UserIdentifyProps {
  userId: string;
  email: string;
  name?: string | null;
  githubUsername?: string | null;
}

/**
 * Identifies the logged-in user in PostHog so all their sessions
 * are linked together. Drop this in any authenticated layout/page.
 */
export function UserIdentify({ userId, email, name, githubUsername }: UserIdentifyProps) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    if (!userId) return;

    posthog.identify(userId, {
      email,
      name:            name ?? undefined,
      github_username: githubUsername ?? undefined,
    });
  }, [userId, email, name, githubUsername]);

  return null;
}
