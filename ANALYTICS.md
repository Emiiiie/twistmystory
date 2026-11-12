# Suivi des événements (PostHog)

Ce fichier liste tous les événements envoyés par le site du test marché Twist My Story.

## Fonctionnement

- Tout passe par `lib/track.ts` :
  - `track(event, data, lang)` envoie un événement ;
  - `trackError(error, data)` envoie une erreur interceptée ;
  - `initAnalytics()` charge et initialise PostHog au chargement de la page.
- Chaque événement est **compté dans `localStorage`** (clé `tms-fd`), même sans PostHog.
- Il est **envoyé à PostHog seulement si `NEXT_PUBLIC_POSTHOG_KEY` est défini**. Sans clé, rien ne quitte le navigateur. En développement, une erreur dans la console signale la clé manquante.
- Projet PostHog : serveur européen (`https://eu.i.posthog.com`).

### Variables d'environnement

| Variable | Valeur | Type dans Vercel |
| --- | --- | --- |
| `NEXT_PUBLIC_POSTHOG_KEY` | clé publique du projet (`phc_…`) | config (pas un secret) |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` | config |

### Propriétés communes

Tous les événements envoyés avec `track()` portent :

| Propriété | Description |
| --- | --- |
| `lang` | langue du site au moment de l'action (`fr` / `en`) |
| `at` | date et heure côté navigateur (ISO 8601) |

PostHog y ajoute ses propriétés habituelles (`$current_url`, `$browser`, `$device_type`, `$referrer`, etc.).

## Le funnel du test marché

```
$pageview → start_click → story_created → with → intro → pay_click → email
```

- `pay_click` mesure l'**intention de payer** : le clic sur « Ouvrir mon histoire pour 1,99 € ». Le paiement est factice, rien n'est débité.
- `email` mesure la **conversion finale** : un e-mail laissé pour réserver une histoire offerte.
- `dialog_close` et `email_declined` montrent **où les visiteurs abandonnent**.

## Événements personnalisés

### Page d'accueil — `components/Landing.tsx`

| Événement | Quand | Propriétés |
| --- | --- | --- |
| `start_click` | clic sur « Commencer à écrire » (ouvre la fenêtre de création) | `position` : `hero` (bouton du haut) ou `closing` (bouton du bas) |
| `demo_send` | le visiteur envoie sa suite dans l'histoire d'exemple « Le colocataire » | `words` : nombre de mots |
| `lang_switch` | bascule FR / EN | `from`, `to` : langue avant / après |

### Fenêtre de création — `components/NewStoryDialog.tsx`

Par ordre d'apparition dans le parcours :

| Événement | Quand | Propriétés |
| --- | --- | --- |
| `story_created` | validation de l'étape 1 (titre ou « plus tard », durée d'un tour) | `pair` : toujours `invite` · `title` : titre saisi, vide si « plus tard » · `period` : durée d'un tour en jours (`3`, `7`, `14`, `30`) |
| `with` | prénom du coauteur validé | `partner` : prénom |
| `ideas_open` | ouverture du carrousel « idées de début » | — |
| `idea_use` | choix d'une idée de début | `idea` : texte de l'idée |
| `intro` | début d'histoire validé (« Créer ») | `partner` · `opening` : texte du début d'histoire (peut être vide) |
| `pay_click` | clic sur « Ouvrir mon histoire pour 1,99 € » | `partner` |
| `email_error` | e-mail refusé à la validation | `reason` : `empty` (vide) ou `bad` (format invalide) |
| `email` | e-mail valide laissé pour l'histoire offerte | `email` · `partner` · `title` |
| `email_declined` | clic sur « Non merci » à l'écran de l'e-mail | `partner` |
| `keep_shown` | à la fermeture, après l'écran e-mail, l'écran « Votre début d'histoire » s'affiche (seulement si un début a été écrit) | — |
| `keep_copy` | clic sur « Copier » dans cet écran | `ok` : `true` si la copie a réussi |
| `dialog_close` | fermeture de la fenêtre (croix, clic à côté, touche Échap, « Non merci », « Fermer ») | voir ci-dessous |

#### Détail de `dialog_close`

`step` indique l'étape où la fenêtre a été fermée :

| `step` | Signification | Autre propriété |
| --- | --- | --- |
| `main` | étape 1, titre et durée | `has_opening` |
| `with` | prénom du coauteur | `has_opening` |
| `intro` | début de l'histoire | `has_opening` |
| `locked` | paywall, avant le clic sur 1,99 € | `has_opening` |
| `sorry` | écran e-mail, sans début d'histoire écrit | `has_opening` (`false`) |
| `done` | confirmation après l'e-mail, sans début d'histoire écrit | `has_opening` (`false`) |
| `keep` | écran « Votre début d'histoire » | `copied` : le texte a-t-il été copié |

Depuis `sorry` ou `done`, si un début d'histoire a été écrit, la fermeture affiche d'abord l'écran « Votre début d'histoire » (`keep_shown`). `dialog_close` n'est alors envoyé qu'en quittant cet écran, avec `step: keep`.

## Identification des visiteurs

- PostHog est configuré avec `person_profiles: "identified_only"` : un profil de personne n'est créé que pour les visiteurs identifiés.
- À l'événement `email`, le visiteur est identifié avec son e-mail (`posthog.identify(email, { email, lang })`). Ses événements précédents de la même visite sont rattachés à ce profil.

> **Données personnelles :** `email`, `partner` (prénom du coauteur), `title` et `opening` (textes écrits par le visiteur) sont envoyés à PostHog. Il faut en parler dans la politique de confidentialité (le lien du pied de page pointe encore vers `#`).

## Erreurs

| Événement | Quand | Propriétés |
| --- | --- | --- |
| `$exception` (automatique) | toute erreur JavaScript non interceptée (`capture_exceptions: true`) | propriétés standard de PostHog (message, pile d'appels…) |
| `$exception` via `trackError` | la copie du début d'histoire a échoué (`keep_copy failed`) | `step` : `keep` |

Ces erreurs apparaissent dans **Error tracking** dans PostHog.

## Événements automatiques de PostHog

Envoyés par `posthog-js` sans code de notre part (`defaults: "2026-05-30"`), selon les réglages du projet PostHog :

| Événement | Description |
| --- | --- |
| `$pageview` | chargement de la page |
| `$pageleave` | départ de la page |
| `$autocapture` | clics et saisies sur les éléments de la page |
| `$rageclick` | clics répétés au même endroit |
| `$web_vitals` | indicateurs de performance (LCP, CLS, INP…) |
| `$identify` | identification par e-mail (voir plus haut) |

## Ajouter un événement

1. Appeler `track("nom_evenement", { propriete: valeur }, lang)` (ou `t(...)` dans `NewStoryDialog.tsx`).
2. Nommer en `snake_case`, au format `objet_action` (`start_click`, `email_declined`).
3. Ajouter une ligne dans ce fichier.
