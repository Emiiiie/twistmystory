# Twist My Story — market test site

Next.js site (App Router, TypeScript) built from the "Twist My Story — Market test" design.

## The flow

1. **Landing page**: introduction, the sample story "The Roommate" where visitors can write the next part (draft kept in the browser), FR / EN switch.
2. **"Start writing"** opens the creation dialog: title (or "later") and turn length.
3. **Co-author**: first name of the person to write with.
4. **Story opening**, with a carousel of "opening ideas".
5. **Fake paywall**: "Open my story for €1.99".
6. **"Not open yet"**: nothing is charged; visitors are offered a free story reserved with their email.
7. On close, visitors can **copy their story opening**.

## Event tracking

`lib/track.ts` records every step of the flow. The full list of events, their properties and the funnel is in [`ANALYTICS.md`](ANALYTICS.md).

Every event also carries `lang` and `at`. It is counted in `localStorage` (`tms-fd`) and, **if a PostHog key is configured**, sent to PostHog (the email is also used to identify the person). Without a key, nothing leaves the browser.

To connect PostHog, copy `.env.example` to `.env.local` (or add the variables in Vercel):

```
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # TypeScript check
```

## Deployment (Vercel)

Import the GitHub repository into Vercel: Next.js is detected automatically, no configuration needed. The PostHog variables are set in *Settings → Environment Variables* (as plain config, not secrets). Every merge to `main` is deployed to production.

## Structure

- `app/`: layout, fonts (IM Fell English, EB Garamond), styles (`design.css` = tokens and responsive rules from the original design, `globals.css` = rebuilt design system and page styles).
- `components/Landing.tsx`: landing page and sample story.
- `components/NewStoryDialog.tsx`: creation dialog and market test flow.
- `components/SuggestDialog.tsx`: opening ideas.
- `lib/strings.ts`: all FR / EN copy.
- `lib/track.ts`: event tracking (PostHog).

To do: the footer links (legal notice, terms, privacy) still point to `#`.
