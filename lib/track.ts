"use client";

import type { PostHog } from "posthog-js";

/**
 * Suivi des événements du test marché.
 *
 * - Toujours : un compteur par événement dans localStorage (clé « tms-fd »), comme dans le prototype.
 * - Si NEXT_PUBLIC_POSTHOG_KEY est défini : l'événement est aussi envoyé à PostHog.
 *   Sans clé, rien ne quitte le navigateur.
 *
 * Événements : story_created, with, intro, ideas_open, idea_use, pay_click, email, keep_shown, keep_copy.
 */

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

let client: Promise<PostHog | null> | null = null;

export function initAnalytics(): Promise<PostHog | null> {
  if (client) return client;
  if (!KEY || typeof window === "undefined") return (client = Promise.resolve(null));
  client = import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(KEY, { api_host: HOST, person_profiles: "identified_only", capture_pageview: true });
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
    if (event === "email" && typeof data.email === "string") ph.identify(data.email, { email: data.email, lang });
    ph.capture(event, props);
  });
}
