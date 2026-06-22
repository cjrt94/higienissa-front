# Grupo Higienissa — Detalle del proyecto e información de la Home

Documento de referencia para validar **qué dice y cómo se estructura la página de inicio** del sitio del ecosistema Grupo Higienissa. El copy que aparece aquí es **verbatim** del wireframe construido (`es/home.html`); su versión inglesa vive en `en/home.html`. Fuente de contenido: `04-content.md`.

---

## Parte 1 · El proyecto en una página

### Qué es
**Grupo Higienissa** es un **ecosistema** del sector higiene, salud y saneamiento, con sede en **Lima, Perú**. La marca madre articula **3 divisiones** que se complementan:

| División | Rol en el ecosistema | Descriptor |
|----------|----------------------|------------|
| **Pacífica** | *Procesa* | Lavandería industrial inteligente |
| **Trazatex** | *Traza* | RFID, software, auditoría y data · *Powered by ASIS IDTRAK* (España) |
| **Operissa** | *Opera* | Operación y gestión textil especializada en terreno |

- **Tesis del ecosistema:** Pacífica procesa · Trazatex aporta datos/RFID · Operissa opera. Cada marca potencia a las otras. **Todo empieza en la lavandería.**
- **Tagline:** *"Un solo ecosistema. Infinitas posibilidades."*
- **Sectores objetivo:** Salud · Hotelería · Industria · Minería (las 3 marcas aplican en los 4 sectores).
- **Idiomas:** Español (completo) e Inglés (estructura + toggle ES|EN funcional).

### Estado y stack
- **Etapa:** M2 (Arquitectura y UX) completada — wireframes navegables, **mid-fi estructural**, bilingües. Siguiente: M3 (diseño visual / mockups).
- **Tecnología:** HTML5 semántico + CSS vanilla. **Sin build, sin frameworks, sin dependencias.** Deploy estático (Vercel).
- **Diseño centralizado:** `assets/styles/tokens.css` (única fuente de color/tipografía) + `wireframe.css` (layout/componentes).
- **Fidelidad actual:** copy y estructura reales; paleta neutra con color de marca solo en nav/CTAs/acentos; imágenes como placeholders grises. La paleta completa, fotografía e iconografía llegan en M3.
- **Repo:** `github.com/cjrt94/higienissa-front.git` (rama `main`). Local: `/Volumes/Projects/higienissa/higienissa-wireframes/`.

### Convenciones de CTA (aplican a la Home)
- **Solicitar evaluación** → CTA genérico del grupo y de los sectores transversales. **Es el que usa la Home.**
- **Solicitar diagnóstico** → reservado al mundo Trazatex/RFID (no aparece en la Home).
- **Conocer Pacífica / Trazatex / Operissa →** → navegación entre marcas.

---

## Parte 2 · La Home, sección por sección

**Archivo:** `es/home.html` (gemela: `en/home.html`).
**`<title>`:** `Grupo Higienissa — Un solo ecosistema. Infinitas posibilidades.`
**Meta description:** *"Ecosistema de higiene textil: lavandería industrial inteligente, trazabilidad RFID con data y operación especializada para salud, hotelería, industria y minería."*

Orden de la página: **Header → Hero → Qué es el grupo → Las 3 divisiones → Pilares → Sectores → Franja ASIS → CTA final → Footer.**

---

### 0 · Header (chrome global — idéntico en todas las páginas)
- **Logo:** lockup horizontal blanco → enlaza a `home.html`.
- **Navegación plana** (sin desplegables): Inicio · Pacífica · Trazatex · Operissa · Sectores · Nosotros · Recursos · **[Contacto]** (botón destacado `.nav-cta`) · selector **ES | EN**.
- En móvil (≤768 px) colapsa a un toggle `☰`.

---

### 1 · Hero del ecosistema
- **Kicker:** Grupo Higienissa
- **H1:** *Un solo ecosistema.<br>Infinitas posibilidades.*
- **Lead:** *"Todo empieza en la lavandería industrial inteligente —y se potencia con datos, trazabilidad y operación especializada— para sostener la disponibilidad del textil en salud, hotelería, industria y minería."*
- **Acciones:** `[Solicitar evaluación]` (primario → `contacto.html`) · `[Conocer el ecosistema]` (ghost → ancla `#ecosistema`).
- **Visual:** placeholder "Visual / Hero" (proporción `tall`). → M3: fotografía real.

---

### 2 · Qué es el grupo *(franja gris bajo el hero — patrón `intro-split`)*
**Columna de texto:**
- **Kicker:** Qué es el grupo
- **H2:** *Un ecosistema que empieza en la lavandería industrial*
- **Lead:** *"Grupo Higienissa integra tres divisiones especializadas del sector higiene, salud y saneamiento: una sola interlocución para procesar, trazar y operar el textil crítico de su operación, bajo un mismo estándar."*

**Panel de destacados (3 tarjetas):**
| Etiqueta | Texto |
|----------|-------|
| Una sola interlocución | Un único interlocutor para procesar, trazar y operar su textil crítico. |
| Un mismo estándar | Calidad, trazabilidad y control consistentes en todo el ciclo del textil. |
| Decisiones con datos | Información real, no estimaciones, para gestionar el activo textil. |

---

### 3 · Las 3 divisiones *(ancla `#ecosistema`)*
- **Kicker:** Las 3 divisiones · **H2:** *Tres marcas, un mismo estándar*
- **3 cards de marca** (`.card-brand`), cada una con placeholder de imagen, título, descripción y enlace:

| Marca | Descripción (verbatim) | Enlace |
|-------|------------------------|--------|
| **Pacífica** | Lavandería industrial inteligente para operaciones que no pueden detenerse: procesos especializados, trazabilidad y disponibilidad garantizada del textil. | Conocer Pacífica → |
| **Trazatex** | RFID, software, auditoría y data que convierten cada activo textil en información gestionable, con control en tiempo real de cada ciclo. | Conocer Trazatex → |
| **Operissa** | Operación y gestión textil especializada en terreno, con personas y procesos a la medida de cada operación. | Conocer Operissa → |

> El descriptor "RFID, software, auditoría y **data**" de Trazatex es el canónico: idéntico en home, sectores y cross-links de marca.

---

### 4 · Pilares — "Lo que nos define" *(franja gris)*
- **Kicker:** Lo que nos define · **H2:** *Lavandería, inteligencia y excelencia operacional*
- **3 pilares** (con ícono SVG inline; texto = beneficio):

| Pilar | Texto |
|-------|-------|
| **Lavandería** | Donde empieza la disponibilidad del textil en cada operación. |
| **Inteligencia y precisión** | Cada decisión y cada activo, respaldados por datos y trazabilidad individual. |
| **Excelencia operacional** | Equipos y procesos que se adaptan a la realidad de cada terreno. |

> Cada pilar mapea a una marca: Lavandería = Pacífica · Inteligencia y precisión = Trazatex · Excelencia operacional = Operissa.

---

### 5 · Sectores — "Soluciones por sector"
- **Kicker:** Sectores · **H2:** *Soluciones por sector*
- **4 cards enlazadas** a su página de sector:

| Sector | Descripción (verbatim) | Enlace |
|--------|------------------------|--------|
| **Salud** | Bioseguridad, auditoría y disponibilidad textil. | → `sector-salud.html` |
| **Hotelería** | Experiencia del huésped y control de blancos. | → `sector-hoteleria.html` |
| **Industria** | Cumplimiento, uniformes y EPP por trabajador. | → `sector-industria.html` |
| **Minería** | Entornos exigentes y operaciones remotas. | → `sector-mineria.html` |

---

### 6 · Franja de respaldo ASIS IDTRAK *(banda discreta `.asis-strip`)*
- Placeholder de logo "ASIS IDTRAK".
- **Texto:** *"En alianza tecnológica con **ASIS IDTRAK** (España) · +30 años en RFID textil."*
- **Enlace:** Conocer Trazatex → (`marca-trazatex.html`).

> **Encuadre obligatorio del grupo:** ASIS IDTRAK es el **socio tecnológico**; la base instalada completa (España + Internacional) vive **solo** en `marca-trazatex.html#respaldo`. En la Home solo se menciona el nombre y el dato de respaldo. ⚠️ Confirmar autorización de difusión antes de publicar.

---

### 7 · CTA final — "Conversemos" *(banda `.cta-band`)*
- **H2:** *Conversemos*
- **Lead:** *"Evaluamos su operación y diseñamos la solución del ecosistema que le corresponde."*
- **CTA:** `[Solicitar evaluación]` → `contacto.html`.

---

### 8 · Footer (chrome global — idéntico en todas las páginas)
- **Marca:** lockup blanco + tagline *"Un solo ecosistema. Infinitas posibilidades."* + redes (LinkedIn · Instagram · YouTube, hoy `#`) + selector ES|EN.
- **Columnas:** Ecosistema (3 marcas) · Sectores (4) · Empresa (Nosotros · Recursos · Contacto) · Contacto (`contacto@higienissa.com` · `+51 1 000 0000` · Lima, Perú) + nota "En alianza tecnológica con ASIS IDTRAK (España)".
- **Bottom:** © Grupo Higienissa · Aviso legal · Privacidad.

---

## Parte 3 · Pendientes que afectan a la Home (antes de publicar / M3)
- **Datos de contacto reales:** email, teléfono (`+51 1 000 0000` es placeholder) y URLs reales de redes sociales (hoy `#`).
- **Autorización ASIS IDTRAK:** confirmar difusión del respaldo antes de publicar.
- **Placeholders visuales:** Hero y card-tops de marca esperan fotografía/ilustración real (M3).
- **Iconografía:** los pilares ya tienen SVG inline; revisar set definitivo en M3.
- **SEO de publicación:** favicon, imágenes Open Graph y `canonical`/`hreflang` ES↔EN (requieren el dominio de producción).
