# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Language

- **Write everything in the repository in English**: code, comments, documentation (README, ANALYTICS.md, this file), and commit messages.
- **Exception — site copy**: the user-facing texts in `lib/strings.ts` exist in French and English. Keep both; never translate or remove the French copy.
- The project owner talks to Claude in French: reply in French in the conversation.

## Talking to the project owner

The project owner is **not a developer**. Explain everything as you would to a beginner:

- Use plain, everyday words. Avoid jargon; when a technical term is unavoidable (commit, branch, deploy…), explain it in one simple sentence.
- Give step-by-step instructions with exact button names and links when the owner has to do something themselves (GitHub, Vercel, PostHog).
- Say what changed on the live site in concrete terms, not in code terms.
- Keep answers short and clear; one idea at a time.

## Project

Twist My Story market test site: a Next.js 16 landing page (App Router, TypeScript, React 19) with a "fake door" flow that measures interest in a co-written story app (fake €1.99 paywall, then email collection). See `README.md` for the flow and structure.

- `components/Landing.tsx`: landing page and sample story.
- `components/NewStoryDialog.tsx`: creation dialog, steps `main → with → intro → locked → sorry → done → keep`.
- `lib/strings.ts`: all FR / EN copy (`useLang()` from `lib/i18n.tsx` gives `L`, `lang`, `toggleLang`).
- `lib/track.ts`: event tracking.
- Styles: `app/design.css` (original design tokens) and `app/globals.css` (rebuilt design system and page styles). No CSS framework.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # tsc --noEmit
npm run build    # production build
```

Run `npm run lint` and `npm run build` before committing. There are no tests.

## Analytics (PostHog)

- All events go through `track()` / `trackError()` in `lib/track.ts`. Never call `posthog` directly from components.
- **When adding, renaming or removing an event, update `ANALYTICS.md`** — it is the reference list of events and properties.
- Event names: `snake_case`, `object_action` form (`start_click`, `email_declined`). Don't rename existing events: it breaks history in PostHog.
- PostHog is optional: with no `NEXT_PUBLIC_POSTHOG_KEY`, the site must keep working and send nothing.
- Project is on PostHog EU cloud (`https://eu.i.posthog.com`). The `phc_…` key is public config, not a secret; never commit `.env.local` anyway.
- Emails collected by the flow are only stored in PostHog (no database). Treat them as personal data.

## Git workflow and deployment

- **Never open pull requests.** Always commit and push directly to `main`.
- Vercel deploys `main` to production automatically: **every push to `main` goes live within a minute or two.** So before every push, run `npm run lint` and `npm run build` and only push if both pass.
- If something breaks after a push, the fastest fix is Vercel → Deployments → previous deployment → "Promote to Production" (instant rollback), then fix the code.
