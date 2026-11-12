"use client";

import type { PostHog } from "posthog-js";

/**
 * Market test event tracking. Full list in ANALYTICS.md.
 *
 * - Always: one counter per event in localStorage (key "tms-fd"), as in the prototype.
 * - If NEXT_PUBLIC_POSTHOG_KEY is set: the event is also sent to PostHog.
 *   Without a key, nothing leaves the browser.
 *
 * Events: see ANALYTICS.md.
 * Uncaught JavaScript errors are also sent to PostHog (error tracking).
 */

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

let client: Promise<PostHog | null> | null = null;

export function initAnalytics(): Promise<PostHog | null> {
  if (client) return client;
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!KEY) {
    if (process.env.NODE_ENV === "development")
      console.error(
        "NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured",
      );
    return (client = Promise.resolve(null));
  }
  client = import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: HOST,
        defaults: "2026-05-30",
        person_profiles: "identified_only",
        capture_exceptions: true,
      });
      return posthog;
    })
    .catch(() => null);
  return client;
}

export function track(event: string, data: Record<string, unknown> = {}, lang?: string) {
  try {
    const k = "tms-fd";
    const d = JSON.parse(localStorage.getItem(k) || "{}");
    d[event] = (d[event] || 0) + 1;
    localStorage.setItem(k, JSON.stringify(d));
  } catch {}
  const props = { ...data, lang, at: new Date().toISOString() };
  initAnalytics().then((ph) => {
    if (!ph) return;
    if (event === "story_email_submit_click" && typeof data.email === "string") ph.identify(data.email, { email: data.email, lang });
    ph.capture(event, props);
  });
}

/** Sends a caught error to PostHog (error tracking). */
export function trackError(error: unknown, data: Record<string, unknown> = {}) {
  initAnalytics().then((ph) => ph?.captureException(error, data));
}
