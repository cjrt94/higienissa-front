# DB.md — Esquema Firestore (fuente de verdad)

> Leer antes de escribir cualquier service/query. Regla de oro: **1 entidad = 1 documento**; el idioma va **dentro del campo** como `{ es, en }`; slugs como ID en colecciones cerradas, `autoId` solo en blog/installations/submissions. Filtrar siempre por `role`/`status`/`published` en colecciones compartidas.

El sitio público (SSG) hoy lee los **JSON semilla en `/content`** (mismo shape). Cuando el admin esté conectado, la lectura pasa a Firestore en build/server — los componentes no cambian.

## Colecciones

### `settings/global`
```
{ contact:{ email, phone, city:{es,en} },
  social:{ linkedin, instagram, youtube },
  asisStrip:{ partnerName:"ASIS IDTRAK", note:{es,en}, link:"/marca-trazatex#respaldo" },
  updatedAt }
```

### `pages/{pageId}`  — home, institucional, contacto, aviso-legal, privacidad, …
```
{ slug, template, status:'draft'|'published', publishedAt,
  blocks:[{ id, type, order, data:{…campos {es,en}} }],
  draft:{ blocks:[…] },
  seo:{ title:{es,en}, description:{es,en} }, updatedAt, updatedBy }
// type ∈ hero | groupIntro | divisions | pillars | sectorsBlock | asis | finalCta
//        | richText | mediaPlaceholder
```

### `brands/{slug}`  — pacifica | trazatex | operissa
```
{ slug, order, name, poweredBy:null|"ASIS IDTRAK",
  hero:{claim:{es,en},eyebrow:{es,en}}, whoWeAre:{title:{es,en},body:{es,en}},
  differentiators:[{es,en}], sectorsApplied:[…], ctaConvention:'evaluacion'|'diagnostico',
  solutions:[{order,title:{es,en},description:{es,en},executedBy,includes:[{es,en}],serves:[{es,en}]}],
  seo:{title:{es,en},description:{es,en}}, published, updatedAt }
// trazatex añade: problemHook, fourLayerModel[], techInfra, infoGenerated, retorno
```
`brands/trazatex/installations/{autoId}` — base ASIS IDTRAK (sensible)
```
{ region:'españa'|'internacional', country:{es,en}, type, name, order,
  publishConsent:false /* autorización + disclaimer obligatorios */, updatedAt }
```

### `sectors/{slug}`  — salud | hoteleria | industria | mineria
```
{ slug, order, icon, name:{es,en}, summary:{es,en}, hero:{eyebrow:{es,en},title:{es,en}},
  context:{es,en}, risks:[{es,en}], whatChanges:[{es,en}], indicators:[{es,en}],
  impactByRole:[{es,en}], brandsApplied:[…], note:{es,en}|null,
  ctaConvention:'evaluacion', seo:{…}, published, updatedAt }
```

### `solutions/{slug}`  — hoy solo "trazabilidad-rfid"
```
{ slug, brandRef:'trazatex', hero, sections:[{type,title:{es,en},body:{es,en},items:[{es,en}]}],
  ctaConvention:'diagnostico', seo, published, updatedAt }
```

### `posts/{autoId}`  — blog
```
{ slugEs, slugEn, title:{es,en}, excerpt:{es,en}, body:{es,en},
  categoryRef, categorySummary:{id,name:{es,en},slug:{es,en}} /* DENORM */,
  author:{name,lastName}, coverImage:{url,alt:{es,en}}, publishedAt:Timestamp,
  status:'draft'|'published', relatedRefs:[postId], seo:{…}, updatedAt }
```
`postCategories/{autoId}` → `{ name:{es,en}, slug:{es,en}, order, postCount /* DENORM por CF */, updatedAt }`

### `legalPages/{slug}`  — aviso-legal | privacidad
```
{ slug, title:{es,en}, body:{es,en}, lastUpdated, status, seo, updatedAt }
```

### `contactSubmissions/{autoId}`  — NO bilingüe (datos del usuario)
```
{ name, lastName, position, company, sector, email, message,
  ctaContext:'evaluacion'|'diagnostico', locale:'es'|'en', consent:bool,
  status:'new'|'read'|'replied', createdAt, source }
```

### `users/{uid}`  — rol en Firestore, NO custom claims
```
{ name, lastName, email, role:'admin'|'editor', active }
```

## Índices (`firestore.indexes.json`)
- `posts(status, publishedAt desc)`
- `posts(categoryRef, status, publishedAt desc)`
- `brands(published, order)`
- `sectors(published, order)`
- `installations(region, order)`
- `contactSubmissions(status, createdAt desc)`

## Reglas clave
- Lectura pública SOLO de docs `published`; `draft` solo admin/editor.
- Escritura solo admin/editor autenticado.
- `contactSubmissions`: `create` público (validado por shape/longitud), `read` solo admin.
- `installations`: exponer solo si `publishConsent==true`.
- `name` + `lastName` **separados**; concatenar solo al mostrar.
