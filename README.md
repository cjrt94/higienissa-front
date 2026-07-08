# Grupo Higienissa — Sitio corporativo

Sitio del ecosistema **Grupo Higienissa** (Pacífica · Trazatex · Operissa) para salud, hotelería, industria y minería.

- **Stack:** Nuxt 3 + Vue 3, **JavaScript nativo** (sin TypeScript), CSS plano con custom properties.
- **Render híbrido** (`routeRules`): público **SSG/prerender** (sin SDK de Firebase en el cliente) · `/admin/**` **SPA** (`ssr:false`).
- **Bilingüe ES/EN** con `@nuxtjs/i18n` (`strategy:'prefix'`, `/es/` · `/en/`). Contenido editorial en `{ es, en }`.
- **Admin embebido** sobre Firebase (Auth + Firestore + Storage + Cloud Functions). Ver `DB.md`.
- **Hosting:** Vercel.

## Desarrollo

```bash
npm install
cp .env.example .env      # completar NUXT_PUBLIC_FIREBASE_* (ver más abajo)
npm run dev               # http://localhost:3000  (redirige a /es)
```

## Estructura

```
assets/css/     tokens.css · site.css · sections.css · admin.css   (diseño "corporativo limpio")
assets/fonts/   Serotiva (titulares)
public/img/     fotografía (banco gratuito, ver CREDITS.md)
public/logos/   isotipo + lockups
components/      átomos (BaseButton/BaseIcon) · chrome (SiteHeader/SiteFooter) · secciones (HeroHome, …) · ui/ (Modal/Toast/Confirm)
composables/     useT · useSiteContent · useFirebase · useAuth · useToast/useConfirm/useModal · useStorage · usePublish
content/         JSON semilla (mismo shape que Firestore): pages/ · brands/ · sectors/ · legal/ · settings.json
pages/           públicas (16 plantillas) + admin/ (SPA)
schemas/         Zod: content.js (bloques) · contact.js
server/          api/contact.post.js + utils/firebaseAdmin.js  (escritura server, sin SDK en cliente)
firebase/        firestore.rules · storage.rules · firestore.indexes.json
functions/       Cloud Functions gen2: publishPage (+ rebuild Vercel) · denormalización
_reference/      wireframes M2 estáticos (referencia histórica, no se sirven)
```

## Contenido administrable

Hoy el público lee los JSON semilla en `content/` (build-time). El **mismo shape** vive en Firestore `pages/{id}` (ver `DB.md`);
al conectar el admin, la lectura pasa a Firestore en build/server sin tocar los componentes. El editor `/admin` edita bloques
(reordenables, bilingües, validados con Zod), guarda `draft` y publica vía Cloud Function `publishPage`, que dispara el rebuild de Vercel.

## Variables de entorno

Ver `.env.example`. Web config de Firebase (`NUXT_PUBLIC_FIREBASE_*`), `FIREBASE_SERVICE_ACCOUNT` (server, para `/api/contact`),
`VERCEL_DEPLOY_HOOK` (rebuild on-publish), `NUXT_PUBLIC_SITE_URL`.

## Pendientes de producción

Ver checklist en `IMPLEMENTATION_PLAN.md` §6 y `CREDITS.md`. En resumen: crear/conectar proyecto Firebase,
importar el contenido semilla a Firestore, datos reales (teléfono/redes), consentimiento ASIS IDTRAK, textos legales definitivos,
y reemplazar la fotografía de banco por fotografía propia.
