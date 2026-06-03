# Wireframes — Grupo Higienissa (Sitio del ecosistema)

Brief de trabajo para construir los **wireframes** del sitio institucional de Grupo Higienissa.
Este archivo es el punto de entrada. Las specs de detalle están en los `0X-*.md` de esta carpeta.

---

## 0. Objetivo de esta etapa (M2 · Arquitectura y UX)

Construir wireframes **navegables en HTML** que validen la **estructura** del sitio antes del diseño visual (M3). No es el diseño final: es el esqueleto de cada plantilla, con la jerarquía de contenido, navegación y recorridos correctos.

**Fidelidad: mid-fi estructural.** (Parámetro ajustable — ver §2.)
- Estructura real, navegación real, microcopy real donde lo tengamos (ver `04-content.md`).
- Bloques de imagen/media como *placeholders* grises.
- Tipografía **Serotiva** en titulares (ya incluida) para que oriente, pero **paleta principalmente neutra**; el color de marca solo en barra de navegación, botones de acción y acentos puntuales.
- El diseño visual completo (color, fotografía, motion) llega en M3.

> Si el cliente prefiere otra fidelidad: cambia esta sección a **lo-fi** (todo gris, sin Serotiva, sin color) o **hi-fi** (aplicar toda la paleta de marca y fotografía). El resto del brief no cambia.

---

## 1. Contexto de marca (resumen)

Grupo Higienissa es un **ecosistema** del sector higiene, salud y saneamiento. La marca madre articula **3 divisiones**:

- **Pacífica** — lavandería industrial inteligente.
- **Trazatex** — RFID, software y auditoría (*Powered by ASIS IDTRAK*, España).
- **Operissa** — operación y gestión especializada.

Las marcas se **complementan** y se enlazan entre sí ("Ecosistema"): Pacífica procesa, Trazatex aporta datos/RFID, Operissa opera.
Sectores objetivo: **Salud, Hotelería, Industria, Minería** (Minería solo en Pacífica y Operissa).

Identidad completa: `../Brand/Brand.md` (estrategia/copy) y `../Brand/Brand_Guidelines.md` (visual).
Arquitectura aprobada: `../Planning/Arquitectura_del_Sitio_Higienissa.pdf`.

---

## 2. Qué construir (alcance)

7 plantillas clave (detalle en `02-templates.md`):

1. Home corporativa (marca madre)
2. Home de marca (Pacífica / Trazatex / Operissa — misma plantilla)
3. Soluciones / detalle de servicio
4. Página de sector (Salud / Hotelería / Industria / Minería)
5. Institucional (Nosotros / Diferencia / Metodología)
6. Recursos (listado de blog + artículo)
7. Contacto (formulario)

Más una **`index.html`** que liste y enlace todos los wireframes (índice de revisión para el cliente).

---

## 3. Convenciones técnicas

- **HTML5 semántico + CSS vanilla.** Sin frameworks, sin build, sin dependencias externas (debe abrir en cualquier navegador y subirse tal cual a hosting estático: Netlify Drop, Cloudflare Pages, etc.).
- **Rutas relativas** para todos los assets (logos, fuente, CSS).
- **Responsive**: desktop primero, con breakpoints para tablet (~768px) y móvil (~420px). Usar CSS Grid/Flexbox.
- **CSS:** usar `assets/styles/tokens.css` (ya provisto: variables de color, fuente Serotiva, escala tipográfica, helpers). Crear `assets/styles/wireframe.css` para el layout. No hardcodear colores: usar las variables.
- **Imágenes:** placeholders con la clase `.placeholder-img` (no buscar fotos reales).
- **Accesibilidad básica:** landmarks (`header/nav/main/footer`), jerarquía de headings correcta, `alt` en logos, foco visible en interactivos.

### Estructura de carpetas a crear

```
Wireframes/
├── index.html                 ← índice navegable de todos los wireframes
├── es/                        ← versión español (construir primero)
│   ├── home.html
│   ├── marca-pacifica.html    (o marca.html parametrizable)
│   ├── marca-trazatex.html
│   ├── marca-operissa.html
│   ├── soluciones.html
│   ├── sector.html            (ej. sector-salud.html)
│   ├── institucional.html
│   ├── recursos.html
│   ├── articulo.html
│   └── contacto.html
├── en/                        ← misma estructura (ver §4 bilingüe)
└── assets/
    ├── styles/  tokens.css (provisto) · wireframe.css (a crear)
    ├── logos/   (provistos)
    └── fonts/   Serotiva (provista)
```

---

## 4. Bilingüe ES / EN

- Sitio en **español e inglés**, con rutas `/es/` y `/en/` y **selector de idioma** en el header.
- **Construir primero ES completo.** Para EN: replicar la estructura; el copy puede quedar como marcador `[EN] …` o traducción simple — lo importante es que el toggle y el ruteo existan y funcionen.

---

## 5. Componentes globales (reutilizar en todas las páginas)

Header/nav global · Footer · Selector de idioma · Botón CTA · Card de marca · Card de servicio · Chip de sector · Bloque "Ecosistema" (enlaces cruzados) · Franja de respaldo ASIS IDTRAK · Formulario de contacto · Breadcrumb.

Detalle de navegación y footer en `01-sitemap.md`. Copys y CTAs en `04-content.md`.

---

## 6. Definición de "listo"

- Las 7 plantillas existen como páginas HTML en `/es/`, navegables entre sí desde el header y desde `index.html`.
- Estructura EN replicada con toggle funcional.
- Responsive en los 3 breakpoints.
- Todo usa `tokens.css` (sin colores hardcodeados) y abre sin servidor ni dependencias.
- Microcopy y listas tomadas de `04-content.md` (no inventar servicios, sectores ni clientes).

---

## 7. Archivos de este paquete

- `CLAUDE.md` (este) — brief maestro.
- `01-sitemap.md` — mapa del sitio, navegación global y footer.
- `02-templates.md` — estructura sección por sección de las 7 plantillas.
- `03-user-flows.md` — recorridos por audiencia (para validar la navegación).
- `04-content.md` — copy real, CTAs, listas de soluciones/sectores y la franja ASIS.
- `assets/` — logos, fuente Serotiva y `tokens.css`.
