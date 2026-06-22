# Plan de implementación — Replicar el diseño ruta B (Editorial) en TODO el sitio Grupo Higienissa

> Producido por workflow multi-agente (entender → diseñar → sintetizar → verificar). Incorpora las correcciones de la verificación adversarial (ver §9). **Es propuesta: no se toca código hasta "procede".**

---

## 0. Resumen ejecutivo + stack recomendado

Migramos el sitio Grupo Higienissa de su estado actual (**wireframes M2 en HTML/CSS vanilla**, 16 plantillas × 2 idiomas) a una **app Nuxt 3 única, en JavaScript nativo (sin TypeScript)**, con **render híbrido por ruta** vía `routeRules`:

- **Público corporativo/institucional → SSG/prerender** (`ssr:true` + `nitro.prerender`, CSS plano con custom properties, **sin SDK de Firebase en cliente** — patrón verificado en `wawa-web`). Las páginas públicas leen Firestore **solo en build/server**, nunca con SDK cliente (no contamina el bundle ni el SEO).
- **`/admin/**` → SPA protegida (`ssr:false`)** que **porta a JS** el patrón maduro de `fiasco-app` (plugins `01.firebase.client` + `02.auth.client`, rol en `users/{uid}`, middleware `auth.global`, composables `useToast`/`useConfirm`/`useModal`/`useStorage`) sobre **Firebase** (Auth + Firestore + Storage + Cloud Functions gen2).

El contenido administrable vive en **Firestore con campos bilingües `{ es, en }` dentro del mismo documento** (1 entidad = 1 doc, nunca documentos gemelos). El chrome/UI bilingüe va en **`@nuxtjs/i18n`** (`strategy:'prefix'`, `/es/` y `/en/`). La **fuente de verdad de diseño es `tokens.css` del handoff** (copiado, con una modificación puntual de `--font-display` por D1 — ver §3); `kit.css` se reescribe sobre la capa semántica. Se implementa **solo la ruta B (Editorial)**; A/C y el switch del prototipo no se construyen.

**Proyecto (confirmado):** se crea un **proyecto nuevo `higienissa-front`** (Nuxt) en `/Volumes/Projects/higienissa/higienissa-front/`. El repo de wireframes (`higienissa-wireframes`, que hoy apunta a `github.com/cjrt94/higienissa-front.git`) **NO se toca** y queda como referencia histórica. `tokens.css`/`kit.css` del handoff se reutilizan; el HTML/CSS vanilla NO. **Hosting: Vercel.** Remoto GitHub: scaffold local **sin remoto** por ahora; se decide al conectar Vercel en Fase 0.

---

## 1. Cumplimiento explícito de los 3 requisitos

### (a) Stack + skills + memoria del equipo — reglas MUST

- **Firebase por defecto** (Auth, Firestore, Storage, Hosting/CF): backend del admin y del modelo de contenido.
- **JS nativo SIN TypeScript**: `nuxt.config.js`, schemas Zod `.js`, composables `.js`. `fiasco-app` es TS (excepción del equipo) → se **porta el patrón** a JS, no se copia.
- **Zod + vee-validate** en TODO formulario (editor de bloques admin + form de contacto). **Greenfield:** se instala `zod` + `vee-validate` + `@vee-validate/zod` desde cero (verificado: vee-validate **no** está hoy en Fiasco/Cofaine; el memo lo exige, se añade nuevo) y se fija la versión compatible con la versión de Vue/Nuxt elegida (regla "leer docs de la versión"). `FormField` deriva required/optional del schema; mensajes en español.
- **Validar longitud máxima**: todo texto con `.max(N, 'Máximo N caracteres.')` + `maxlength`; layout tolera 2 líneas.
- **Nunca dialogs nativos**: `Modal`/`ConfirmDialog`/`Toast` propios. Ni `alert`/`confirm`/`prompt`.
- **No refetch tras mutación**: tras crear/editar/reordenar → lista local in-place (push/splice/update con el ID); recargar Firestore solo en mount o petición explícita.
- **Denormalizar + Cloud Functions**: `postCategories.postCount`, `posts.categorySummary`, `sectorSummary[]`; propagación con `onDocumentWritten` (objeto summary, no campos planos).
- **Lazy loading**: el admin abre el panel de edición de inmediato y carga la data async; nunca bloquear el click con `await`.
- **Deploy de `firestore.rules` + `storage.rules`** como paso final tras tocar permisos.
- **Leer docs de la versión** antes de usar `@nuxtjs/i18n` (primer i18n del equipo) y vee-validate.
- **`DB.md`** en la raíz (a crear) como fuente de verdad del esquema; leerlo antes de escribir cualquier service/query; filtrar por `role`/`status`/`published` en colecciones compartidas.
- **`name` + `lastName` separados** en `users/{uid}`, `posts.author`, `contactSubmissions`; concatenar solo al mostrar.
- **Changelog obligatorio doble** (raíz Sam `- <tipo>(higienissa): …` + `CHANGELOG.md` del proyecto) en cada commit, leyendo versión del `package.json`.
- **changelog-public** = archivo `.js` en repo (build time), NUNCA Firestore; solo si se expone `/changelog`. Registrar/actualizar la fila real en `projects/changelog-paths.md` (ver §9).
- **Nunca `--no-verify`** ni saltar hooks.
- **`.env` desde el inicio** (`NUXT_PUBLIC_FIREBASE_*` → `runtimeConfig.public`); `.gitignore` con `.env`; nunca hardcodear credenciales.
- **Diseñar desde cero**: se reutiliza el *patrón* de convención de Fiasco/wawa, no su código.
- **Proponer antes de implementar**; **delegar por dominio** (Charlie front · Dean backend/Firestore · Bobby devops · Rowena UX/a11y; Sam orquesta).

### (b) Front administrable desde el inicio (sin rehacer)

La administrabilidad **se construye en la Fase 2, ANTES de los componentes del Home**, sobre el inventario real de bloques del handoff. Cada tipo de bloque = **1 schema Zod + 1 componente Vue de render + 1 editor**. La Home define la **librería de bloques** que el resto reutiliza. Contenido en Firestore con `draft`/`published`, preview con los mismos componentes, publicación vía Cloud Function. Así, cuando se construyen los componentes (Fase 3) **ya consumen datos administrables** — no hay rework.

### (c) Bilingüe ES/EN

- **Ruteo `/es/` y `/en/` simétrico** (`@nuxtjs/i18n` `strategy:'prefix'`, `defaultLocale:'es'`, `detectBrowserLanguage:false` → toggle manual como el wireframe). Espeja la estructura de carpetas del M2 y los `.lang-switch`.
- **Chrome/UI** (nav, footer, microcopy, `aria-labels`, skip-link, toggle) en `locales/es.json` + `en.json` → el módulo genera **hreflang + canonical + og:locale** (resuelve el hueco del handoff).
- **Contenido editorial** bilingüe en Firestore `{ es, en }` por campo; helper `t(field, locale)` con fallback `field?.[locale] ?? field?.es ?? ''`. El editor edita ambos idiomas en el mismo panel.
- **Blog**: `slugEs`/`slugEn` por locale (SEO real en `/en/`); el resto de plantillas conserva nombre de archivo compartido (convención del wireframe).

---

## 2. Arquitectura

### 2.1 Framework / render + hosting

- **Nuxt 3 + Vue 3, JS nativo, `nuxt.config.js`, `type:module`.** (Nuxt 3 sobre 4 por menor riesgo: i18n y SSG probados en `wawa-web`; Nuxt 4 → D-NUXT-VER.)
- **Render híbrido por `routeRules`** (no modo global):
  - `'/**': { ssr:true, prerender:true }` → corporativo/institucional. **Lectura de Firestore solo en build/server**, nunca SDK cliente.
  - `'/admin/**': { ssr:false, prerender:false, robots:false }` → SPA cliente con SDK Firebase reactivo (fuera del bundle público).
  - Blog: **SSG + rebuild on-publish** (B2B, baja frecuencia); subir a ISR solo si el ritmo lo exige (D-RENDER-BLOG).
- **Estilos: CSS plano con custom properties (NO Tailwind).** La fuente de verdad ya es `tokens.css`; meter Tailwind recrearía los 3 vocabularios que D2 vino a unificar.
- **Rebuild on-publish (Vercel):** publicar no es automático con SSG. La Cloud Function `publishPage` llama una **Deploy Hook URL** de Vercel. Para el blog se puede usar **ISR** (nativo en Vercel) y evitar el rebuild completo. Sin este mecanismo, "administrable" no se traduce en "visible en producción" sin intervención manual.
- **Hosting: Vercel (CONFIRMADO).** Excepción consciente al default Firebase del equipo (igual que Fiasco-TS). Habilita ISR nativo (blog) y Deploy Hooks; las env vars viven en Vercel + `.env` local.

### 2.2 Admin / CMS

**Decisión firme: NO CMS headless, NO backoffice separado.** Una sola app Nuxt sirve el público (SSG) y embebe el admin (`/admin/**`, SPA). Un CMS externo viola "Firebase por defecto"; un backoffice separado duplica plugin Firebase, design system y deploy sin ganar nada.

- **Editor por bloque**: lista bloques, orden con `vuedraggable`, panel por bloque (`Modal` propio) con `FormField` derivado de Zod + vee-validate, toggle es/en por campo. Tras guardar/reordenar → lista local in-place, nunca refetch.
- **draft/published en el MISMO doc** (sub-objeto `draft`): publicar = `draft → published` + `publishedAt` vía CF `publishPage` (que además dispara el rebuild, §2.1); preview en `/admin/preview/[page]` con los mismos componentes y `data = draft`.
- **Media a Storage**: `useStorage` sube a `images/{pageId}/{blockId}/{uuid}`; el bloque guarda `{ url, path, alt:{es,en}, width, height }`. `MediaPlaceholder` muestra `<img>`/`<video>` si hay url, si no la caja lisa `#eef0f6` (**nunca patrón**).

### 2.3 Modelo de contenido Firestore + i18n (esquema concreto)

**Regla de oro:** 1 entidad = 1 documento; idioma dentro del campo como `{ es, en }`; slugs como ID en colecciones cerradas, `autoId` solo en blog/installations/submissions.

```
settings/global
  { contact:{ email, phone, city:{es,en} }, social:{ linkedin, instagram, youtube },
    asisStrip:{ partnerName:"ASIS IDTRAK", note:{es,en}, link:"marca-trazatex#respaldo" }, updatedAt }

pages/{pageId}   // home, institucional, contacto, aviso-legal, privacidad, …
  { slug, template, status:'draft'|'published', publishedAt,
    blocks:[{ id, type, order, data:{…campos {es,en}} }],
    draft:{ blocks:[…] },
    seo:{ title:{es,en}, description:{es,en} }, updatedAt, updatedBy }
  // type ∈ hero | ecosystemIndex | whatIsGroup | divisionsList | pillars
  //        | sectorsGrid | asisStrip | ctaFinal | richText | mediaPlaceholder

brands/{slug}    // pacifica | trazatex | operissa
  { slug, order, name, poweredBy:null|"ASIS IDTRAK",
    hero:{claim:{es,en},eyebrow:{es,en}}, whoWeAre:{title:{es,en},body:{es,en}},
    differentiators:[{es,en}], sectorsApplied:[…], ctaConvention:'evaluacion'|'diagnostico',
    solutions:[{order,title:{es,en},description:{es,en},executedBy,includes:[{es,en}],serves:[{es,en}]}],
    seo:{title:{es,en},description:{es,en}}, published, updatedAt }
  // trazatex añade: problemHook, fourLayerModel[], techInfra, infoGenerated, retorno
brands/trazatex/installations/{autoId}   // base ASIS IDTRAK (sensible)
  { region:'españa'|'internacional', country:{es,en}, type, name, order,
    publishConsent:false /* autorización + disclaimer obligatorios */, updatedAt }

sectors/{slug}   // salud | hoteleria | industria | mineria
  { slug, order, icon, name:{es,en}, summary:{es,en}, hero:{eyebrow:{es,en},title:{es,en}},
    context:{es,en}, risks:[{es,en}], whatChanges:[{es,en}], indicators:[{es,en}],
    impactByRole:[{es,en}], brandsApplied:[…], note:{es,en}|null,
    ctaConvention:'evaluacion', seo:{…}, published, updatedAt }

solutions/{slug}  // hoy solo "trazabilidad-rfid" (excepción SEO de Trazatex)
  { slug, brandRef:'trazatex', hero, sections:[{type,title:{es,en},body:{es,en},items:[{es,en}]}],
    ctaConvention:'diagnostico', seo, published, updatedAt }

posts/{autoId}    // blog
  { slugEs, slugEn, title:{es,en}, excerpt:{es,en}, body:{es,en},
    categoryRef, categorySummary:{id,name:{es,en},slug:{es,en}} /* DENORM */,
    author:{name,lastName}, coverImage:{url,alt:{es,en}}, publishedAt:Timestamp,
    status:'draft'|'published', relatedRefs:[postId], seo:{…}, updatedAt }
postCategories/{autoId}
  { name:{es,en}, slug:{es,en}, order, postCount /* DENORM por CF */, updatedAt }

legalPages/{slug}  // aviso-legal | privacidad
  { slug, title:{es,en}, body:{es,en}, lastUpdated, status, seo, updatedAt }

contactSubmissions/{autoId}  // NO bilingüe (datos del usuario)
  { name, lastName, position, company, sector, email, message,
    ctaContext:'evaluacion'|'diagnostico', locale:'es'|'en', consent:bool,
    status:'new'|'read'|'replied', createdAt, source }

users/{uid}        // rol en Firestore, NO custom claims (patrón Fiasco)
  { name, lastName, email, role:'admin'|'editor', active }
```

**Índices (`firestore.indexes.json`):** `posts(status, publishedAt desc)`; `posts(categoryRef, status, publishedAt desc)`; `brands(published, order)`; `sectors(published, order)`; `installations(region, order)`; `contactSubmissions(status, createdAt desc)`.

**i18n:** `@nuxtjs/i18n` `strategy:'prefix'`, `defaultLocale:'es'`, `detectBrowserLanguage:false`. Chrome en `locales/*.json`; contenido editorial en Firestore `{es,en}`. SEO automático.

### 2.4 Seguridad

- **`firestore.rules` + `storage.rules`** en `firebase/`. Lectura pública SOLO de docs `published`; `draft` solo admin/editor. Escritura solo admin/editor autenticado. `contactSubmissions`: `create` público (validado por shape/longitud) + `read` solo admin. `installations`: `publishConsent==true` para exponer.
- **Auth (patrón Fiasco → JS):** `01.firebase.client.js`, `02.auth.client.js` (`onAuthStateChanged` único + perfil `users/{uid}`), `useAuth` (`isAdmin`/`isEditor`), middleware `auth.global.js` (redirige a `/login`, whitelist público + `/changelog`) + `admin.js`/`editor.js`.
- **Deploy de rules + índices** como paso final tras tocar permisos.

---

## 3. Implementación del design system (ruta B)

### 3.1 Resolución de D1–D9

- **D1 (Serotiva → faux-bold) — CONFIRMADO.** Titulares 700 en **Poppins** (`--font-display: "Poppins","Serotiva",system-ui,sans-serif`); Serotiva Regular 400 solo para números display (el "3", 01/02/03). `font-synthesis:none` global. **Esto implica MODIFICAR `--font-display` en `tokens.css`** (no es copia literal — ver §3.2). Reversible si se licencia Serotiva Bold.
- **D2 (3 vocabularios → 1).** Capa semántica `--color-*` de `tokens.css` como ÚNICO origen. Reescribir `kit.css` sobre ella; eliminar `--azul`/`--ink2` (kit) y `--accent`/`--fg`/`--mark`/`--band-bg`/`--card-sh` (prototipo). Colapsar A/B/C a los valores fijos de T.b. Añadir `--line-soft:#e7e9f2` (matiz de bandas).
- **D3 (breakpoints + layout).** Unificar a **900px** (descartar 860 de kit). Tokenizar `--container-max:1180px`, `--container-pad:28px`, `--bp-md:900px`. (CSS no interpola `var()` en `@media` → el `900` queda literal, comentado; el token sirve para `matchMedia`/`useMediaQuery` y docs.)
- **D4 (a11y M2, no regresar).** El kit monta: skip-link `#main`; landmarks `header`/`nav`/`main`/`footer`; `aria-current="page"` (computed por ruta) + `"true"` en idioma activo; `:focus-visible` global; **un solo `<h1>`** por página; burger con `aria-expanded`/`aria-controls`. Re-verificar tras hidratación SPA.
- **D5 (contraste).** `--ink-3 #8b90a8` sobre blanco ≈3.0:1 falla AA texto normal; eyebrow eléctrico 13px ≈3.7:1 límite. Limitar `--ink-3` a labels; el editor debe **impedir** crear texto que falle AA; pase de contraste antes de cerrar paleta.
- **D6 (px vs escala).** Snap a la escala 1.250 **salvo el H1 hero (58px)** como override documentado.
- **D7 (@font-face duplicado).** Único dueño: `tokens.css` (ruta `fonts/Serotiva…`). `base.css` ya no declara Serotiva.
- **D8 (alcance).** Semilla + 1 plantilla: primero librería + Home; luego las 15 restantes y paridad EN.
- **D9 (handoff = fuente de verdad).** Confirmar que `design_handoff_home` reemplaza a `es/home.html` (índice de ecosistema, tarjeta-dato, lista numerada, card de CTA) y actualizar `HOME.md`/`CLAUDE.md`/wireframe.

### 3.2 Tokens y estructura de estilos (`assets/css/`)

- **`tokens.css`** (capa A): basado en el del handoff; único dueño del `@font-face` (D7); **con `--font-display` modificado por D1** y los layout tokens de D3 añadidos. (No es copia 100% literal: la única edición de origen es el orden de `--font-display`.)
- **`base.css`** (capa B): `kit.css` reescrito sobre roles semánticos (D2); reset, `.wrap`, `.btn` y variantes, `.eyebrow`, links, inputs, `:focus-visible`, skip-link, `font-synthesis:none`.
- **`home.css`** (capa C): estilos por bloque del Home; las demás plantillas añaden capas reutilizando átomos.

### 3.3 Librería de componentes Vue (`components/`, auto-import)

- **Átomos:** `BaseButton` (primary/accent/secondary/ghost, pill, hover `brightness(1.04)`, active `scale(.985)`), `BaseEyebrow` (accent/primary), `BaseLink` (subrayado 0→100% 240ms), `BaseCard` (hover `translateY(-4px)` 280ms), `BaseIcon` (SVG Lucide stroke 1.75–2; **NUNCA emoji**, sin fallback a glyph), `MediaPlaceholder` (caja lisa, ratio + label + slot play/chip, **sin patrón**).
- **Chrome:** `SiteHeader` (logo lockup azul, `NavBar` plana, `LangToggle`, `BaseButton` Contacto, burger), `SiteFooter` (4 columnas, lockup blanco, redes).
- **Secciones Home (9 bloques, 1:1 con el inventario):** `HeroEditorial`, `EcosystemIndex`, `GroupIntro` (+`DataCard`+`HighlightRow`), `DivisionsList`, `PillarsGrid` (+`PillarCard`), `SectorsGrid` (+`SectorCard`), `AsisStrip`, `FinalCta` (+`ActionCard`). Copy por props/datos (habilita i18n).

### 3.4 Prohibición del patrón de marca + "sin emoji" (invariantes de código)

- `MediaPlaceholder` y superficies oscuras (`FinalCta` azul, `SiteFooter`) **no aceptan** prop ni clase de fondo con imagen/patrón. Al colapsar a T.b se eliminan las variables `--*-pat`, así que el patrón es **físicamente inalcanzable**.
- El isotipo solo como favicon/ícono puntual/logo; **nunca tileado/rotado/marca de agua/en bordes**.
- `BaseIcon` solo renderiza `<svg>` Lucide local. El editor de media **impide estructuralmente** subir el isotipo como fondo.

---

## 4. Roadmap por fases (objetivo · entregables · agente · skills)

**Fase 0 — Decisión + scaffolding + gobernanza.** Cerrar decisiones bloqueantes y crear el proyecto. Entregables: D-HOST/D-CMS-BLOG/D-NUXT-VER/D1/D9/D-MIGRACION confirmadas; scaffold Nuxt 3 JS (`routeRules`, `type:module`); `.env` + `runtimeConfig.public` + `.gitignore`; `CHANGELOG.md` del proyecto; **`DB.md` inicial**; **actualizar `projects/registry.md`** (añadir **Dean**, estado `wireframes→active`, keywords `nuxt/admin/cms/i18n`); **actualizar (no duplicar) la fila `higienissa-wireframes` en `projects/changelog-paths.md`** con CHANGELOG técnico real, `/changelog`+`changelog-public.js` si aplica, y el hook que se instale. **Bobby** + **Sam**. Skills: `project-setup`, `changelog`, `onboard-project`.

**Fase 1 — Tokens + base + chrome accesible.** Fundar el design system ruta B. Entregables: `tokens.css` (D1/D3/D7), `base.css` (D2, `:focus-visible`, skip-link, `font-synthesis:none`), átomos, chrome (`SiteHeader`/`SiteFooter` con landmarks, aria-current, burger). **Rowena** + **Charlie**. Skills: `ui-standards-audit`, `consistency-audit`.

**Fase 2 — Modelo de contenido + admin (administrable desde el inicio).** Que el contenido sea editable antes de construir páginas. Entregables: colecciones Firestore + Zod schemas `.js` por tipo de bloque, `firestore.rules`/`storage.rules`/`firestore.indexes.json`, auth (plugins + `useAuth` + middleware), editor `/admin` por bloque (draft/published, preview, `vuedraggable`, composables propios, `useStorage`, lista local in-place), Cloud Functions `publishPage` (+ **rebuild trigger** §2.1) + denormalización + deploy de rules. **Dean** + **Charlie** + **Bobby**. Skills: `changelog`, `code-review`.

**Fase 3 — Componentes del Home (ruta B).** Los 9 bloques + `pages/index.vue` consumiendo datos administrables; pixel-check contra T.b. Entregables: los 9 componentes; un solo `<h1>`; placeholders lisos; CTA "Solicitar evaluación". **Charlie** + **Rowena**. Skills: `ui-standards-audit`.

**Fase 4 — Resto de plantillas.** Derivar las 15 restantes reutilizando la librería. Entregables: 3 marcas (Trazatex +`#respaldo` con disclaimer), hub + 4 sectores, soluciones, institucional, contacto (form Zod+vee-validate + `.max` → `contactSubmissions`), recursos+articulo, legales. **Charlie** + **Dean**. Skills: `consistency-audit`, `code-review`.

**Fase 5 — Paridad EN (i18n real).** Toggle visual → funcional. Entregables: `@nuxtjs/i18n` `prefix`, `locales/es.json`+`en.json`, contenido `{es,en}` con fallback ES, `.lang-switch` re-mapeado, hreflang/canonical. **Charlie** + **Dean/Castiel** (contenido EN). Skills: `consistency-audit`.

**Fase 6 — SEO / launch.** Cerrar pendientes y desplegar. Entregables: canonical/hreflang/OG/favicon (isotipo nunca tileado), datos reales (contacto/redes), autorización ASIS + `publishConsent`, textos legales, deploy de rules, changelogs, rebuild on-publish verificado, pase final AA. **Bobby** + **Dean** + **Rowena**. Skills: `changelog`, `code-review`.

---

## 5. Orden de construcción de las 16 plantillas × 2 idiomas

7 plantillas únicas (8 layouts contando recursos-listado vs artículo) → 16 páginas/idioma. ES primero; EN se deriva con i18n (Fase 5).

1. **Home corporativa** (1): `home` — Fase 3, define la librería de bloques.
2. **Home de marca** (3): `marca-pacifica`, `marca-trazatex` (+`#respaldo`), `marca-operissa` — Fase 4.
3. **Detalle de servicio/Soluciones** (1): `soluciones` (RFID Trazatex, única detalle por SEO) — Fase 4.
4. **Sector** (5): `sectores` (hub) + `sector-salud`/`-hoteleria`/`-industria`/`-mineria` — Fase 4.
5. **Institucional** (1): `institucional` — Fase 4.
6. **Recursos** (2 layouts): `recursos` (listado, filtros/paginación reales) + `articulo` (slug por locale, body, relacionados) — Fase 4, único bloque genuinamente dinámico.
7. **Contacto** (1): `contacto` (form → `contactSubmissions`) — Fase 4.
8. **Legales (stub)** (2): `aviso-legal` + `privacidad` — Fase 4.

Cada par ES/EN comparte nombre de archivo (espejo 1:1) y se enlaza por `.lang-switch`.

---

## 6. Checklist pre-launch

- [ ] **SEO**: canonical + hreflang ES↔EN (por `@nuxtjs/i18n`), OG/Twitter, favicon (isotipo, nunca tileado), `<title>`/description por plantilla en `{es,en}`.
- [ ] **Datos reales**: correo confirmado, teléfono real (no `+51 1 000 0000`), URLs de redes (hoy `#`), fotografía del hero y divisiones.
- [ ] **Autorización ASIS IDTRAK**: consentimiento de difusión; `publishConsent=true`; disclaimer; solo en `marca-trazatex#respaldo`.
- [ ] **Legal**: textos definitivos de aviso-legal + privacidad.
- [ ] **Tipografía (D1)**: Poppins 700 + `font-synthesis:none`, o licencia Serotiva Bold.
- [ ] **a11y/contraste**: pase AA (limitar `--ink-3`); skip-link/landmarks/aria-current/`:focus-visible` verificados tras hidratación.
- [ ] **Deploy de rules + índices** tras tocar permisos.
- [ ] **Changelog**: raíz Sam + proyecto en cada commit; `changelog-public.js` si hay `/changelog`; fila en `changelog-paths.md`; nunca `--no-verify`.
- [ ] **Rebuild on-publish** verificado (Deploy Hook / CI según hosting).

---

## 7. Decisiones abiertas (confirmar antes de arrancar)

**Confirmadas (2026-06-20):**
- ✅ **D-HOST = Vercel.** Excepción consciente al default Firebase. Habilita ISR nativo (blog) y rebuild on-publish vía **Deploy Hook URL** llamada desde la CF `publishPage`.
- ✅ **Admin embebido** en la misma app Nuxt (`/admin` SPA `ssr:false` + público SSG). NO CMS headless ni backoffice separado.
- ✅ **D1 = Poppins 700 + `font-synthesis:none`** (Serotiva Regular 400 solo para números display). Reversible si se licencia Serotiva Bold.
- ✅ **D-MIGRACION = proyecto NUEVO separado `higienissa-front`** (Nuxt) en `/Volumes/Projects/higienissa/higienissa-front/`. El repo `higienissa-wireframes` **NO se toca** y queda como referencia histórica. Se reutilizan `tokens.css`/`kit.css` del handoff; el HTML/CSS vanilla NO.
  - ✅ **Remoto GitHub:** scaffold local **sin remoto** por ahora; se decide al conectar Vercel en Fase 0. El repo de wireframes (que usa `cjrt94/higienissa-front.git`) no se toca.

**No bloqueantes (recomendación entre paréntesis):**
- **D-CMS-BLOG** — blog en Firestore (si publica un no-dev) vs archivos en repo + redeploy (si publica el equipo dev). *(Depende de quién edita.)*
- **D-RENDER-BLOG** — SSG + rebuild on-publish (recomendado arrancar aquí) vs ISR (solo si el ritmo lo exige).
- **D-NUXT-VER** — Nuxt 3 (recomendado, menor riesgo) vs Nuxt 4 (futuro del equipo, ya en Cofaine).
- **D-I18N/D8** — confirmar `strategy:'prefix'` con slugs en español en ambos idiomas; y si se publica EN ya o solo ES por ahora.
- **D9** — handoff = fuente de verdad del Home (actualizar `HOME.md`/`CLAUDE.md`/wireframe).
- **D6** — snap a escala 1.250 salvo H1 hero (recomendado). **D2 matiz** — añadir `--line-soft` (recomendado).
- **Roles** — `admin` + `editor` (¿hace falta `viewer`/`marketing`?). **Íconos Lucide** son sustitución — validar con marca (Industria/Hotelería). **Slugs `/en/`** — confirmar blog con slug traducido.

---

## 8. Riesgos y mitigaciones

- **i18n desde cero** (ningún proyecto usa `@nuxtjs/i18n`): leer docs de la versión, separar chrome (JSON) de contenido editorial (Firestore `{es,en}`). Será el primer i18n del equipo.
- **Regresión de a11y al migrar a SPA**: el prototipo no trae `<main>`/skip-link/aria-current/focus (el M2 sí, 16/16). Re-aplicar en cada cambio de ruta. Es MUST.
- **Tensión hosting vs default**: decidir D-HOST explícitamente o se arrastra inconsistencia operativa.
- **ISR no nativo en Firebase**; **SSG + Firestore exige rebuild on-publish** (mecanismo definido en §2.1).
- **Contenido sensible ASIS**: `publishConsent` default false + disclaimer + solo en Trazatex#respaldo. Publicar sin autorización = riesgo legal/de marca.
- **Contraste AA con contenido editable**: limitar `--ink-3` e impedirlo en el editor.
- **D1 Serotiva**: faux-bold es el riesgo a evitar; si marca exige Serotiva en titulares, licenciar Bold antes de cerrar tokens.
- **Hooks/changelog del repo**: crear ambos changelogs desde el primer commit; registrar la fila real antes de tocar `changelog-public`; nunca `--no-verify`.
- **No mezclar Tailwind con `tokens.css`** (recrearía los 3 vocabularios de D2).
- **Costo de lecturas sin denormalizar**: hub de sectores y listado de blog → usar summary + Cloud Functions (riesgo de drift si una función falla).
- **No usar otros proyectos como template literal**: se porta el patrón (Fiasco TS → JS), no se copia.

---

## 9. Verificación adversarial (resumen)

Un agente revisor contrastó el plan contra el código real. **Veredicto: cumple los 3 requisitos** (`stackAndMemory`, `administrableFromStart`, `bilingual` = ✅) y no inventa patrones (confirmó `useAuth`/`useConfirm`/`useModal`/`useStorage`/`useToast` + plugins en Fiasco, `vuedraggable ^4.1.0`, `zod ^4`, y que ningún proyecto usa `@nuxtjs/i18n`). Correcciones ya integradas en este documento:

1. **Identidad del repo** — `higienissa-wireframes` == `higienissa-front` (mismo `.git`). D-MIGRACION reescrita (§7).
2. **registry.md** — Fase 0 actualiza la fila (añadir Dean, `wireframes→active`, keywords) por regla global #1 (§4).
3. **changelog-paths.md** — actualizar la fila existente, no duplicar (§4/§7).
4. **vee-validate greenfield** — no está hoy en los proyectos; se instala nuevo + check de versión (§1a).
5. **tokens.css** — se aclara que `--font-display` SÍ se modifica (D1); no es copia 100% literal (§3.1/§3.2).
6. **rebuild on-publish** — mecanismo concreto por hosting (Deploy Hook / CI) (§2.1).
7. **Público sin SDK cliente** — las páginas públicas leen Firestore solo en build/server; el SDK reactivo solo en `/admin` (§0/§2.1).
