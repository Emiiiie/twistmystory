# Twist My Story — site du test marché

Site Next.js (App Router, TypeScript) reprenant le design « Twist My Story — Test marché ».

## Le parcours

1. **Accueil** : présentation, histoire d'exemple « Le colocataire » où le visiteur peut écrire la suite (brouillon gardé dans le navigateur), bascule FR / EN.
2. **« Commencer à écrire »** ouvre la fenêtre de création : titre (ou « plus tard ») et durée d'un tour.
3. **Coauteur** : prénom de la personne avec qui écrire.
4. **Début de l'histoire**, avec un carrousel d'« idées de début ».
5. **Paywall factice** : « Ouvrir mon histoire pour 1,99 € ».
6. **« Pas encore ouvert »** : rien n'est débité, on propose de réserver une histoire offerte avec son e-mail.
7. À la fermeture, le visiteur peut **copier son début d'histoire**.

## Suivi des événements

`lib/track.ts` enregistre chaque étape du parcours. La liste complète des événements, de leurs propriétés et du funnel est dans [`ANALYTICS.md`](ANALYTICS.md).

Chaque événement porte aussi `lang` et `at`. Il est compté dans `localStorage` (`tms-fd`) et, **si une clé PostHog est configurée**, envoyé à PostHog (l'e-mail sert aussi à identifier la personne). Sans clé, rien ne quitte le navigateur.

Pour brancher PostHog, copiez `.env.example` en `.env.local` (ou ajoutez les variables dans Vercel) :

```
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

## Développement

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
npm run lint     # vérification TypeScript
```

## Déploiement (Vercel)

Importez le dépôt GitHub dans Vercel : le framework Next.js est détecté automatiquement, aucune configuration n'est nécessaire. Ajoutez les variables PostHog dans *Settings → Environment Variables* quand vous serez prêt.

## Organisation

- `app/` : mise en page, polices (IM Fell English, EB Garamond), styles (`design.css` = tokens et règles responsive du design d'origine, `globals.css` = design system reconstruit et styles de page).
- `components/Landing.tsx` : page d'accueil et histoire d'exemple.
- `components/NewStoryDialog.tsx` : fenêtre de création et parcours du test marché.
- `components/SuggestDialog.tsx` : idées de début.
- `lib/strings.ts` : tous les textes FR / EN.

À faire : les liens du pied de page (mentions légales, CGU, confidentialité) pointent encore vers `#`.
