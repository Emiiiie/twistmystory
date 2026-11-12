# Event tracking (PostHog)

This file lists every event sent by the Twist My Story market test site.

## How it works

- Everything goes through `lib/track.ts`:
  - `track(event, data, lang)` sends an event;
  - `trackError(error, data)` sends a caught error;
  - `initAnalytics()` loads and initializes PostHog when the page loads.
- Every event is **counted in `localStorage`** (key `tms-fd`), even without PostHog.
- It is **sent to PostHog only if `NEXT_PUBLIC_POSTHOG_KEY` is set**. Without a key, nothing leaves the browser. In development, a console error flags the missing key.
- PostHog project: EU cloud (`https://eu.i.posthog.com`).

### Environment variables

| Variable | Value | Type in Vercel |
| --- | --- | --- |
| `NEXT_PUBLIC_POSTHOG_KEY` | public project key (`phc_…`) | config (not a secret) |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` | config |

### Common properties

Every event sent with `track()` carries:

| Property | Description |
| --- | --- |
| `lang` | site language at the time of the action (`fr` / `en`) |
| `at` | browser-side date and time (ISO 8601) |

PostHog adds its usual properties (`$current_url`, `$browser`, `$device_type`, `$referrer`, etc.).

## The market test funnel

```
$pageview → start_click → story_created → with → intro → pay_click → email
```

- `pay_click` measures **intent to pay**: the click on "Open my story for €1.99". The payment is fake; nothing is charged.
- `email` measures the **final conversion**: an email left to reserve a free story.
- `dialog_close` and `email_declined` show **where visitors drop off**.

## Custom events

### Landing page — `components/Landing.tsx`

| Event | When | Properties |
| --- | --- | --- |
| `start_click` | click on "Start writing" (opens the creation dialog) | `position`: `hero` (top button) or `closing` (bottom button) |
| `demo_send` | the visitor sends their part in the sample story "The Roommate" | `words`: word count |
| `lang_switch` | FR / EN switch | `from`, `to`: language before / after |

### Creation dialog — `components/NewStoryDialog.tsx`

In flow order:

| Event | When | Properties |
| --- | --- | --- |
| `story_created` | step 1 submitted (title or "later", turn length) | `pair`: always `invite` · `title`: entered title, empty if "later" · `period`: turn length in days (`3`, `7`, `14`, `30`) |
| `with` | co-author's first name submitted | `partner`: first name |
| `ideas_open` | "Opening ideas" carousel opened | — |
| `idea_use` | an opening idea picked | `idea`: idea text |
| `intro` | story opening submitted ("Create my story") | `partner` · `opening`: story opening text (may be empty) |
| `pay_click` | click on "Open my story for €1.99" | `partner` |
| `email_error` | email rejected on submit | `reason`: `empty` or `bad` (invalid format) |
| `email` | valid email left for the free story | `email` · `partner` · `title` |
| `email_declined` | click on "No thanks" on the email screen | `partner` |
| `keep_shown` | on close, after the email screen, the "Your story opening" screen is shown (only if an opening was written) | — |
| `keep_copy` | click on "Copy text" on that screen | `ok`: `true` if the copy succeeded |
| `dialog_close` | dialog closed (close button, click outside, Escape key, "No thanks", "Close") | see below |

#### `dialog_close` details

`step` is the step at which the dialog was closed:

| `step` | Meaning | Other property |
| --- | --- | --- |
| `main` | step 1, title and turn length | `has_opening` |
| `with` | co-author's first name | `has_opening` |
| `intro` | story opening | `has_opening` |
| `locked` | paywall, before the €1.99 click | `has_opening` |
| `sorry` | email screen, no story opening written | `has_opening` (`false`) |
| `done` | confirmation after the email, no story opening written | `has_opening` (`false`) |
| `keep` | "Your story opening" screen | `copied`: whether the text was copied |

From `sorry` or `done`, if a story opening was written, closing first shows the "Your story opening" screen (`keep_shown`). `dialog_close` is then only sent when leaving that screen, with `step: keep`.

## Identifying visitors

- PostHog is configured with `person_profiles: "identified_only"`: a person profile is only created for identified visitors.
- On the `email` event, the visitor is identified by their email (`posthog.identify(email, { email, lang })`). Their earlier events from the same visit are linked to that profile.
- Emails are **only stored in PostHog** (the site has no database). To get the list: PostHog → People, or filter Activity on the `email` event.

> **Personal data:** `email`, `partner` (co-author's first name), `title` and `opening` (text written by the visitor) are sent to PostHog. This must be covered by the privacy policy (the footer link still points to `#`).

## Errors

| Event | When | Properties |
| --- | --- | --- |
| `$exception` (automatic) | any uncaught JavaScript error (`capture_exceptions: true`) | standard PostHog properties (message, stack trace…) |
| `$exception` via `trackError` | copying the story opening failed (`keep_copy failed`) | `step`: `keep` |

These errors show up in **Error tracking** in PostHog.

## Automatic PostHog events

Sent by `posthog-js` without any code on our side (`defaults: "2026-05-30"`), depending on the PostHog project settings:

| Event | Description |
| --- | --- |
| `$pageview` | page load |
| `$pageleave` | leaving the page |
| `$autocapture` | clicks and inputs on page elements |
| `$rageclick` | repeated clicks in the same spot |
| `$web_vitals` | performance metrics (LCP, CLS, INP…) |
| `$identify` | identification by email (see above) |

## Adding an event

1. Call `track("event_name", { property: value }, lang)` (or `t(...)` in `NewStoryDialog.tsx`).
2. Use `snake_case`, in `object_action` form (`start_click`, `email_declined`).
3. Add a row to this file.
