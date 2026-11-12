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
$pageview → start_click → story_title_create_click → story_partner_continue_click
          → story_intro_continue_click → story_paywall_pay_click → story_email_submit_click
```

- `story_paywall_pay_click` measures **intent to pay**: the click on "Open my story for €1.99". The payment is fake; nothing is charged.
- `story_email_submit_click` measures the **final conversion**: an email left to reserve a free story.
- `story_close_click` and `story_email_no_thanks_click` show **where visitors drop off**.

## Custom events

### Landing page — `components/Landing.tsx`

| Event | When | Properties |
| --- | --- | --- |
| `start_click` | click on "Start writing" (opens the creation dialog) | `position`: `hero` (top button) or `closing` (bottom button) |
| `demo_send` | the visitor sends their part in the sample story "The Roommate" | `words`: word count |
| `lang_switch` | FR / EN switch | `from`, `to`: language before / after |

### Creation dialog — `components/NewStoryDialog.tsx`

Every event in this dialog is named `story_<screen>_<button>_click`, so the name says which button was clicked on which screen. In flow order:

| Event | Screen → button clicked | Properties |
| --- | --- | --- |
| `story_title_create_click` | step 1 (title and turn length) → "Create my story" (or Enter key) | `pair`: always `invite` · `title`: entered title, empty if "later" · `period`: turn length in days (`3`, `7`, `14`, `30`) |
| `story_partner_continue_click` | co-author's first name → "Continue" (or Enter key) | `partner`: first name |
| `story_intro_ideas_click` | story opening → "Opening ideas" (opens the carousel) | — |
| `story_ideas_choose_click` | opening ideas carousel → "Choose →" | `idea`: idea text |
| `story_intro_continue_click` | story opening → "Create my story" | `partner` · `opening`: story opening text (may be empty) |
| `story_paywall_pay_click` | paywall → "Open my story for €1.99" | `partner` |
| `story_email_submit_invalid_click` | email screen → "Save my free story", but the email is rejected | `reason`: `empty` or `bad` (invalid format) |
| `story_email_submit_click` | email screen → "Save my free story", with a valid email | `email` · `partner` · `title` |
| `story_email_no_thanks_click` | email screen → "No thanks" | `partner` |
| `story_keep_copy_click` | "Your story opening" screen → "Copy text" | `ok`: `true` if the copy succeeded |
| `story_close_click` | any screen → close (close button, "Close", "No thanks", click outside the dialog, or Escape key) | see below |

#### `story_close_click` details

| Property | Description |
| --- | --- |
| `step` | screen on which the dialog was closed (see the table below) |
| `has_opening` | whether a story opening was written (not sent from `keep`) |
| `to_keep` | `true` if closing opens the "Your story opening" screen instead of closing the dialog |
| `copied` | only from `keep`: whether the text was copied |

| `step` | Screen |
| --- | --- |
| `main` | step 1, title and turn length |
| `with` | co-author's first name |
| `intro` | story opening |
| `locked` | paywall, before the €1.99 click |
| `sorry` | email screen |
| `done` | confirmation after the email |
| `keep` | "Your story opening" screen |

From `sorry` or `done`, if a story opening was written, closing does not close the dialog yet: it shows the "Your story opening" screen (`to_keep: true`). The dialog really closes on the next `story_close_click`, with `step: keep`.

"No thanks" sends `story_email_no_thanks_click` then `story_close_click` (`step: sorry`).

#### Renamed events

These events were renamed on 2026-11-12. Data sent before that date is under the old names in PostHog.

| Old name | New name |
| --- | --- |
| `story_created` | `story_title_create_click` |
| `with` | `story_partner_continue_click` |
| `ideas_open` | `story_intro_ideas_click` |
| `idea_use` | `story_ideas_choose_click` |
| `intro` | `story_intro_continue_click` |
| `pay_click` | `story_paywall_pay_click` |
| `email_error` | `story_email_submit_invalid_click` |
| `email` | `story_email_submit_click` |
| `email_declined` | `story_email_no_thanks_click` |
| `keep_copy` | `story_keep_copy_click` |
| `dialog_close` | `story_close_click` |
| `keep_shown` | removed: now `story_close_click` with `to_keep: true` |

## Identifying visitors

- PostHog is configured with `person_profiles: "identified_only"`: a person profile is only created for identified visitors.
- On the `story_email_submit_click` event, the visitor is identified by their email (`posthog.identify(email, { email, lang })`). Their earlier events from the same visit are linked to that profile.
- Emails are **only stored in PostHog** (the site has no database). To get the list: PostHog → People, or filter Activity on the `story_email_submit_click` event.

> **Personal data:** `email`, `partner` (co-author's first name), `title` and `opening` (text written by the visitor) are sent to PostHog. This must be covered by the privacy policy (the footer link still points to `#`).

## Errors

| Event | When | Properties |
| --- | --- | --- |
| `$exception` (automatic) | any uncaught JavaScript error (`capture_exceptions: true`) | standard PostHog properties (message, stack trace…) |
| `$exception` via `trackError` | copying the story opening failed (`story_keep_copy_click failed`) | `step`: `keep` |

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
2. Use `snake_case`. Click events end with `_click`; in the creation dialog, use `story_<screen>_<button>_click` (`story_intro_continue_click`).
3. Add a row to this file.
