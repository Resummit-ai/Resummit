"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (!key) return; // Silently skip in dev if no key set

    posthog.init(key, {
      api_host: host,
      capture_pageview: false,      // We handle this manually below
      capture_pageleave: true,
      persistence: "localStorage",
      autocapture: true,            // Captures clicks, inputs automatically
      session_recording: {
        maskAllInputs: true,        // Privacy: mask typed text
        maskTextSelector: "[data-ph-mask]",
      },
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

/**
 * Tracks page views on every route change, including UTM parameters.
 * Drop this inside PostHogProvider > Suspense.
 */
export function PageViewTracker() {
  const pathname  = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    posthog.capture("$pageview", {
      $current_url: url,
      // PostHog auto-reads utm_source, utm_medium, utm_campaign from URL
    });
  }, [pathname, searchParams]);

  return null;
}
