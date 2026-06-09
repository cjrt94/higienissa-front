# Grupo Higienissa — Sitio del ecosistema · Documentación del proyecto

Documento maestro del proyecto. Punto de entrada para cualquiera (humano o Claude) que retome el trabajo.
Refleja el **estado real construido** y el camino para **escalar a mockups (M3)**.

> Las specs originales de la etapa de wireframes están en `01-sitemap.md`, `02-templates.md`, `03-user-flows.md`, `04-content.md`.
> Donde este `CLAUDE.md` y esas specs difieran, **manda este documento** (recoge las decisiones tomadas durante la construcción).

---

## 0. Estado actual

- **Etapa completada:** **M2 · Arquitectura y UX** — wireframes navegables, mid-fi estructural, bilingües ES/EN.
- **Siguiente etapa:** **M3 · Diseño visual (mockups)** — ver §8 (handoff).
- **Deploy:** sitio **estático** (HTML5 + CSS vanilla, sin build) preparado para **Vercel**.
- **Repo:** `origin` → `https://github.com/cjrt94/higienissa-front.git` (rama `main`).
- **Ruta local:** `/Volumes/Projects/higienissa/higienissa-wireframes/`.

---

## 1. Contexto de marca

**Grupo Higienissa** es un **ecosistema** del sector higiene, salud y saneamiento. La marca madre articula **3 divisiones** que se complementan:

- **Pacífica** — Lavandería industrial inteligente. *(procesa)*
- **Trazatex** — RFID, software, auditoría y **data**. *Powered by ASIS IDTRAK* (España). *(aporta datos/trazabilidad — la información es valor central para la gestión textil hospitalaria, hotelera, etc.)*
- **Operissa** — Operación y gestión especializada. *(opera en terreno)*

**Tesis del ecosistema:** Pacífica procesa · Trazatex aporta datos/RFID · Operissa opera. Cada marca potencia a las otras.

- **Tagline:** "Un solo ecosistema. Infinitas posibilidades."
- **Sectores objetivo:** Salud · Hotelería · Industria · Minería. (Las **3 marcas aplican en los 4 sectores**; en Industria con matiz de tercerización — ver §2 decisión #5.)
- **Sede:** **Lima, Perú** (teléfonos con código **+51**; no usar Santiago/Chile).
- **Idiomas:** Español (completo) e Inglés (estructura + toggle funcional).

---

## 2. Arquitectura de información (tal como está construida)

### Modelo de navegación
Menú **plano**, sin desplegables. **Una página por empresa.** Las páginas del grupo (Sectores, Nosotros, Recursos, Contacto) son **transversales**.

```
Inicio · Pacífica · Trazatex · Operissa · Sectores · Nosotros · Recursos · [Contacto] · ES|EN
```

- `Pacífica / Trazatex / Operissa` → enlace directo a su única página de marca (lo que antes eran sub-ítems —diferencia, metodología— ahora son **secciones dentro** de cada página).
- `Sectores` → **hub** `sectores.html`, que lista los 4 sectores.
- `Contacto` es el botón de acción destacado (`.nav-cta`).
- `Soluciones` **no** está en el menú: es la **única página de detalle separada** (excepción por SEO), accesible desde la sección Soluciones de Trazatex.

### Decisiones de IA tomadas (con su razón)
1. **Nav plano (sin dropdowns):** los desplegables sugerían 4-5 páginas por marca y mezclaban destinos de grupo/marca → confuso. Una empresa = una página.
2. **`Soluciones` como única página separada:** por valor SEO. Hoy `soluciones.html` es el detalle de la solución de Trazatex *"Trazabilidad textil RFID"*. Las soluciones de cada marca se detallan **inline** en su página (cards con listas Incluye/Atiende).
3. **Sectores: hub + 4 detalles.** `sectores.html` (hub) + `sector-salud/-hoteleria/-industria/-mineria.html`. Cada enlace lleva a su sector real (no a un ejemplo).
4. **Respaldo ASIS IDTRAK — solo en Trazatex:** la base instalada completa (España + Internacional) vive **únicamente en `marca-trazatex.html`** (con sello *Powered by ASIS IDTRAK* y disclaimer obligatorio). Se **quitó de `institucional.html`** (Nosotros). En `marca-pacifica.html` y `marca-operissa.html` solo aparece el **nombre ASIS IDTRAK** como nota de footer, **enlazado** a `marca-trazatex.html#respaldo` ("si hacen click, los manda al rollo completo"). El footer enlaza ese nombre en **todas** las páginas (chrome consistente).
5. **Marcas por sector — las 3 aplican en todos:** Salud, Hotelería y Minería muestran las **3 marcas** (Pacífica + Trazatex + Operissa). **Industria** también las 3, pero con **nota**: predomina el modelo tercerizado (Operissa + Trazatex) y Pacífica procesa en planta según el caso. (Antes cada sector mostraba solo 2 marcas; revertido por feedback del cliente.)
6. **OPERISSA Logistics:** incluida como **5ª solución propia** de Operissa.
7. **Pilares del home y énfasis en lavandería:** los pilares se reformularon a **Lavandería** (núcleo · Pacífica) · **Inteligencia y precisión** (fusión de las dos antiguas · Trazatex) · **Excelencia operacional** (Operissa), y se **movieron a debajo de "Las 3 divisiones"**. El hero del home refuerza la lavandería como núcleo del ecosistema. La tríada duplicada en `institucional.html` se **eliminó**.
8. **Trazatex aplica a los 4 sectores:** sus chips "Sectores que atendemos" (en `marca-trazatex.html`) incluyen **Minería** (además de Salud/Hotelería/Industria), coherente con que las 3 marcas aplican en todos los sectores.
9. **Convención de CTA:** *"Solicitar diagnóstico"* se reserva al mundo **Trazatex/RFID** (`marca-trazatex.html`, `soluciones.html` y la opción correspondiente del form). El resto del sitio —grupo y los 4 sectores (transversales/multimarca)— usa *"Solicitar evaluación"*.
10. **Convención "data":** "data" se usa como **etiqueta corta** de capacidad de Trazatex (en descriptores de card: "RFID, software, auditoría y data"); en prosa se usa **"datos"**. El descriptor canónico de Trazatex es idéntico en home, sectores y cross-links de marca.

### Ajustes post-revisión UX/copy (ronda de QA)
Tras una revisión multi-agente de UX + copywriting se corrigieron, entre otros: hub de Sectores actualizado a 3 marcas (coincidía 2 vs 3 del detalle); **bug de lang-switch del footer** que en el hub y 3 sectores apuntaba a `sector-salud` (ahora cada footer apunta a su propia gemela); limpieza de marcadores `[EN]` residuales en `en/`; descriptor "data" de Trazatex propagado a los cross-links de marca; `<title>` de `institucional` alineado a "…y cómo trabajamos"; nota de wireframe quitada del hero de `sector-salud`; doble flecha en `.link-arrow` (texto + CSS); paridad ES↔EN en metodología de Operissa y franjas ASIS. **Accesibilidad:** se añadió **skip-link** (`#main`, con CSS `.skip-link`) y los títulos de columna del footer pasaron de `<h4>` a `<h3>` (jerarquía sin saltos).

**Ronda 2 (todo lo deferido):** CTA de la banda final promovida a `btn-primary` en todo el sitio; pilares del home reformulados a beneficios (manteniendo los títulos de Gabriel); bloque compacto "Las 3 divisiones" añadido a Nosotros (solo navegación a marcas); las 9 cards de Trazatex consolidadas a 6 (sin solapamiento con el modelo de 4 capas); pulido de jerga del meta del home y de la muletilla "no se detiene"; **páginas legales stub creadas** (`aviso-legal.html` / `privacidad.html`, ES+EN) y enlazadas desde el footer de todas las páginas y desde el consentimiento del formulario. **Pendiente pre-publicación** (requiere dominio/URLs reales): `canonical`/`hreflang` ES↔EN, URLs reales de redes sociales, **texto legal definitivo** de las páginas legales, y favicon/OG.

---

## 3. Estructura de archivos

```
higienissa-wireframes/
├── index.html                 ← índice de revisión (lista las páginas ES y EN)
├── es/                        ← 14 páginas, copy real completo
│   ├── home.html              · Home corporativa (Grupo Higienissa)
│   ├── marca-pacifica.html    · Home de marca — Pacífica
│   ├── marca-trazatex.html    · Home de marca — Trazatex (+ respaldo ASIS)
│   ├── marca-operissa.html    · Home de marca — Operissa
│   ├── sectores.html          · Hub de sectores
│   ├── sector-salud.html      · Sector Salud
│   ├── sector-hoteleria.html  · Sector Hotelería
│   ├── sector-industria.html  · Sector Industria
│   ├── sector-mineria.html    · Sector Minería
│   ├── soluciones.html        · Detalle de servicio (Trazatex · RFID)
│   ├── institucional.html     · Nosotros / Metodología / Diferenciadores (sin base instalada — vive en Trazatex)
│   ├── recursos.html          · Blog (listado)
│   ├── articulo.html          · Artículo
│   ├── contacto.html          · Formulario de contacto
│   ├── aviso-legal.html       · Legal (stub · borrador, contenido pendiente)
│   └── privacidad.html        · Política de privacidad (stub · borrador, contenido pendiente)
├── en/                        ← misma estructura (16 páginas), chrome en inglés + toggle ES|EN
└── assets/
    ├── styles/
    │   ├── tokens.css         ← ÚNICA fuente de verdad: color, tipografía, escala, espaciado
    │   └── wireframe.css      ← layout + componentes (usa solo variables de tokens.css)
    ├── logos/                 ← lockup + isotipo (azul / negro / blanco)
    └── fonts/                 ← Serotiva (titulares)
```

Plantillas → páginas: Home(1) · Home de marca(2, ×3) · Detalle de servicio(3) · Sector(4, hub + ×4) · Institucional(5) · Recursos listado(6a) · Artículo(6b) · Contacto(7).

---

## 4. Convenciones técnicas

- **HTML5 semántico + CSS vanilla.** Sin frameworks, sin build, sin dependencias. Abre por `file://` o cualquier hosting estático.
- **Rutas relativas** para todos los assets (`../assets/...` en páginas; `assets/...` en `index.html`).
- **No hardcodear color/tipografía:** usar siempre `var(--token)` de `tokens.css`.
- **Imágenes/media:** placeholders grises con `.placeholder-img` (sin fotos reales en esta etapa).
- **Bilingüe:** ruteo `/es/` y `/en/`; cada página enlaza a su gemela con el selector `.lang-switch` (en header y footer). Los enlaces internos usan el **mismo nombre de archivo** (resuelven dentro de su idioma).
- **Accesibilidad:** landmarks (`header/nav/main/footer`), un solo `<h1>` por página, `aria-current="page"` en el ítem de nav activo, `alt` en logos, foco visible.
- **Responsive:** desktop primero; breakpoints en **980 / 768 / 420 px** (Grid/Flexbox). Menú colapsa a toggle en ≤768.
- **Consistencia del chrome:** header/nav/footer son **idénticos** en todas las páginas de un idioma (solo varían `aria-current` y el destino del toggle). Si se regenera, mantener esa invariante.

---

## 5. Sistema de diseño (inventario para M3)

### Tokens (`assets/styles/tokens.css`)
- **Colores de marca:** `--azul #1C2A87` · `--celeste #4EA7E1` · `--gris-marca #A5A283` · `--electrico #3A78FF` · `--negro #000`.
- **Neutros (estructura mid-fi):** `--ink --text --muted --line --bg --bg-alt --block`.
- **Tipografía:** `--font-display` = **Serotiva** (titulares) · `--font-body` = Inter/sistema. Escala `--fs-*` (display, h1-h3, body, small, kicker).
- **Espaciado:** `--space-1…8` · `--maxw 1200px` · `--radius` · `--header-h 64px`.

### Componentes (clases en `wireframe.css`)
`site-header` / `main-nav` (+ `nav-cta`, `lang-switch`, `nav-toggle`) · `breadcrumb` · `hero` (`hero-grid`) · `btn-primary` / `btn-ghost` / `link-arrow` (`more-link`) · `card` (+ `card-brand`, `card-cross`, `card-sub`, `card-list`) · `pillars`/`pillar` · `steps`/`step`/`step-num` · `chips`/`chip` · `ecosystem` (`ecosystem-diagram`, `eco-node`, `eco-mother`) · `asis-strip` · `installed-base` + `disclaimer` · `cta-band` · `form-panel`/`form-grid`/`form-field`/`form-check`/`form-actions` (+ `req`, `form-hint`) · `site-footer` (`footer-grid`, `footer-brand`, `footer-social`) · `wf-index`/`index-card`.

> En M2 el color de marca se usa **solo** en navegación, CTAs y acentos puntuales; el resto es neutro. **M3 activa la paleta completa** (ver §8).

---

## 6. Contenido

- **Fuente de verdad:** `04-content.md` (copy real verificado). **No inventar** servicios, sectores ni clientes.
- Incluye: claims y diferenciadores por marca, soluciones **con detalle** (Incluye/Atiende), modelo de 4 capas de Trazatex, metodología de Operissa, y **copy estratégico por sector** (Contexto → Riesgos → Qué cambia → Indicadores → Impacto por rol).
- **Respaldo ASIS IDTRAK — base instalada** (España + Internacional): presente **solo en `marca-trazatex.html`**, **siempre con el disclaimer**: son instalaciones del **socio tecnológico ASIS IDTRAK**, no clientes de Higienissa. En el resto del sitio solo se menciona el **nombre** (enlazado a esa sección).

### Pendientes de contenido (para M3 / antes de publicar)
- ⚠️ **Autorización de difusión** de la base instalada ASIS IDTRAK y marcas de terceros — **confirmar antes de publicar**.
- **OPERISSA Logistics:** se incluyó como 5ª solución; confirmar si se publica como solución propia o se integra.
- **Minería:** no tiene copy estratégico propio en `04-content.md` (se aborda vía Pacífica/Operissa); su página usa contenido estructural. Si el cliente quiere, desarrollar copy.
- El material referencia `../Brand/Brand.md §9.1` (copy verbatim de sectores) y `../Brand/Brand_Guidelines.md` (visual) — **esos archivos no están en el repo**; conseguirlos para M3.

---

## 7. Deploy (Vercel)

- Sitio **estático, sin build**. Preset **Other**, Build Command vacío, Output Directory = raíz.
- `vercel.json`: sin `cleanUrls` (se conservan los `.html` explícitos); redirecciones `/es`→`/es/home.html`, `/en`→`/en/home.html`; `/` sirve `index.html`.
- `.vercelignore`: excluye los `.md` de trabajo del deploy.
- `.gitignore`: `.DS_Store`, `.vercel`, etc.
- **Flujo:** `git push origin main` → deploy automático (si el repo está conectado en Vercel).
- **Preview local:** `python3 -m http.server 8000` y abrir `http://localhost:8000/`.

---

## 8. Cómo escalar a M3 — Mockups / Diseño visual (HANDOFF)

M3 toma este esqueleto aprobado y lo **viste**. El proyecto está diseñado para que el salto sea de **baja fricción**.

### Qué debe hacer M3
1. **Activar la paleta de marca completa.** Hoy el color vive solo en nav/CTAs. M3 lo extiende a secciones, fondos, acentos y estados. **Se hace tocando `tokens.css`** y un puñado de clases en `wireframe.css` — sin reescribir páginas.
2. **Reemplazar `.placeholder-img`** por **fotografía/ilustración real** (sin tocar la estructura de las páginas). Los placeholders ya están en su sitio y con proporciones definidas (`tall`, `wide`).
3. **Tipografía y jerarquía finas:** pesos de Serotiva, tamaños, interlineado, tracking.
4. **Motion / microinteracciones:** hovers, transiciones, scroll-reveal, estados de formulario.
5. **Iconografía** para pilares, pasos, sectores y redes sociales del footer (hoy texto/placeholder).
6. **Estados completos del formulario** (focus/valid/error/success) y de la navegación móvil.

### Puntos de apoyo ya preparados
- **`tokens.css` = única fuente de verdad.** Cambiar variables propaga a todo el sitio.
- **Componentes aislados por clase** (ver §5) → migran limpio a un design system o a Figma / a un CMS por bloques.
- **Chrome consistente** (header/footer idénticos) → un solo lugar conceptual que rediseñar.
- **Contenido real ya colocado** → M3 diseña sobre texto definitivo, no lorem ipsum.
- **Bilingüe y ruteo ya existen** → el diseño no tiene que reestructurar nada para EN.

### Sugerencia de entregables M3
- `assets/styles/tokens.css` con la paleta y tipografía finales aplicadas.
- Un `mockup.css` (o evolución de `wireframe.css`) con el tratamiento visual.
- Inventario de assets visuales (fotografía por sección, íconos).
- Si se va a Figma: mapear los componentes de §5 a componentes de Figma (Code Connect).

### Antes de publicar (checklist)
- [ ] Confirmar autorización ASIS IDTRAK (§6).
- [ ] Resolver estatus de OPERISSA Logistics (§6).
- [ ] Datos de contacto reales (email/teléfono/dirección) y URLs reales de redes sociales (hoy `#`).
- [x] Páginas legales: stubs `aviso-legal.html` / `privacidad.html` (ES+EN) creados y enlazados — **falta el texto legal definitivo** (hoy "borrador").
- [x] Marcadores `[EN]` eliminados — queda pulir copy EN final donde sea traducción ligera.
- [ ] Favicon e imágenes Open Graph + `canonical`/`hreflang` ES↔EN (requieren el dominio de producción).

---

## 9. Archivos del paquete

- `CLAUDE.md` (este) — documento maestro / handoff.
- `01-sitemap.md` · `02-templates.md` · `03-user-flows.md` — specs originales de M2 (referencia histórica; ver nota inicial).
- `04-content.md` — **copy real (fuente de verdad de contenido).**
- `README.md` — preview local y guía de deploy.
- `assets/` — logos, fuente Serotiva, `tokens.css`, `wireframe.css`.
