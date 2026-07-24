# Infrastructure — higienissa-front

Corporate site for Grupo Higienissa. Single Nuxt 3 app (JS, no TypeScript) that
serves the public site (SSG) and embeds a Firestore-backed CMS at `/admin` (SPA).

## Runtime topology

- **Public site** — SSG/prerender via `routeRules['/**'].prerender`. Content is read
  **server-side only** through the internal API `server/api/content/[...path]` (Firebase
  Admin SDK). No Firebase client SDK ships in the public bundle. When Firestore is not
  configured, the API falls back to the seed JSON in `content/**`, so the site always renders.
- **Admin** — `/admin/**` is `ssr:false` (client SPA), guarded in `layouts/admin.vue`.
  It uses the Firebase Web SDK (Auth/Firestore/Storage) loaded lazily, out of the public bundle.
- **Publish loop** — pages use `draft.blocks → blocks` via the `publishPage` Cloud Function;
  flat collections (settings/brands/sectors) and the blog use the `rebuild` Cloud Function.
  Both trigger a **Vercel Deploy Hook** so the SSG site regenerates with fresh Firestore data.

## Hosting & services

- **Hosting:** Vercel (public SSG + admin SPA + Nitro API). No Firebase Hosting.
- **Firebase:** Auth (email/password), Firestore, Storage, Cloud Functions (gen2).
  - **Firestore/Storage region:** `southamerica-east1` (São Paulo) — permanent.
  - **Plan:** Blaze (required by Storage image uploads and Cloud Functions).
- **Data model:** see `DB.md`. Bilingual `{es,en}` fields inside each document.

## Environment variables (`.env`)

| Var | Purpose |
|-----|---------|
| `NUXT_PUBLIC_SITE_URL` | Canonical site URL (SEO, sitemap, OG). |
| `NUXT_PUBLIC_FIREBASE_*` | Web SDK config (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) — admin only. |
| `FIREBASE_SERVICE_ACCOUNT` | Admin SDK service account JSON (single line) — server-side reads + scripts. |
| `VERCEL_DEPLOY_HOOK` | Deploy Hook URL; also set as a Cloud Functions secret. |

The **project ID is not hardcoded** anywhere — it lives in `NUXT_PUBLIC_FIREBASE_PROJECT_ID`,
`.firebaserc` (generated), and the `PROJECT_ID` variable of the provisioning script.

## Provisioning (Fase 0)

Firebase project creation is deferred; when the project ID is chosen, run:

```bash
PROJECT_ID=<id> ./scripts/provision.sh          # create project, .firebaserc, Firestore (region),
                                                # deploy rules/indexes/storage/functions
STAFF_EMAIL=<email> STAFF_PASSWORD=<pw> \
  node scripts/create-staff.mjs                 # staff admin user + users/{uid} (role admin)
npm run seed                                     # content/** → Firestore (pages, settings,
                                                # brands, sectors, legal, blog: 5 cats + 6 posts)
```

Manual (console/interactive) steps the script cannot do: enable Email/Password sign-in,
create the Vercel Deploy Hook, and fill `.env` (`NUXT_PUBLIC_FIREBASE_*` from
`firebase apps:sdkconfig`, `FIREBASE_SERVICE_ACCOUNT`, `VERCEL_DEPLOY_HOOK`). Details in
`scripts/provision.sh`.

## Deploy of security rules

`firebase/firestore.rules`, `firebase/storage.rules`, `firebase/firestore.indexes.json`.
Deploy after any permission change:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```
