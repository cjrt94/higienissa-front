# Grupo Higienissa — Wireframes (M2 · Arquitectura y UX)

Wireframes **navegables en HTML** del sitio del ecosistema Grupo Higienissa.
Validan la **estructura** del sitio (navegación, jerarquía de contenido, recorridos) antes del diseño visual (M3).

**Fidelidad:** mid-fi estructural — estructura y copy reales, paleta neutra, color de marca solo en navegación / CTAs / acentos, imágenes como placeholders grises. La paleta de marca completa, fotografía y motion llegan en **M3**.

## Estructura

```
higienissa-wireframes/
├── index.html              ← índice de revisión (lista los 10 wireframes ES + EN)
├── es/                     ← versión español (completa, copy real)
│   ├── home.html           · Home corporativa (Grupo Higienissa)
│   ├── marca-pacifica.html · Home de marca — Pacífica
│   ├── marca-trazatex.html · Home de marca — Trazatex (Powered by ASIS IDTRAK)
│   ├── marca-operissa.html · Home de marca — Operissa
│   ├── soluciones.html     · Detalle de servicio (ej. Trazabilidad textil RFID)
│   ├── sector-salud.html   · Página de sector (ejemplo: Salud)
│   ├── institucional.html  · Nosotros / Diferencia / Metodología + respaldo ASIS
│   ├── recursos.html       · Blog (listado)
│   ├── articulo.html       · Artículo
│   └── contacto.html       · Formulario de contacto
├── en/                     ← misma estructura, chrome en inglés + toggle ES|EN
└── assets/
    ├── styles/  tokens.css (paleta/tipografía — fuente de verdad) · wireframe.css (layout)
    ├── logos/   lockup + isotipo (azul/negro/blanco)
    └── fonts/   Serotiva (titulares)
```

## Previsualizar localmente

Abren sin servidor ni dependencias (rutas relativas, HTML5 + CSS vanilla):

```bash
# Opción simple: abrir el índice directamente en el navegador
open index.html

# Opción recomendada (server estático local):
cd higienissa-wireframes && python3 -m http.server 8000
# → http://localhost:8000/   (índice)   ·   /es/home.html   ·   /en/home.html
```

## Publicar en Vercel

Sitio **estático, sin build**. Tres formas:

1. **Drag & drop** — arrastrar la carpeta `higienissa-wireframes/` a https://vercel.com/new (o usar [Vercel Drop](https://vercel.com/drop)).
2. **Git** — importar el repo en Vercel. Preset de framework: **Other**. Build Command: *(vacío)*. Output Directory: *(vacío / raíz)*.
3. **CLI** — `npm i -g vercel` y luego `vercel` (deploy de preview) / `vercel --prod`.

`vercel.json` ya define:
- Sin `cleanUrls` (se conservan los enlaces `.html` explícitos entre páginas).
- Redirecciones de cortesía: `/es` → `/es/home.html`, `/en` → `/en/home.html`.
- `/` sirve `index.html` (el índice de revisión).

`.vercelignore` excluye del deploy los documentos de trabajo internos (`*.md` del brief).

## Notas para M3

- **Color/tipografía centralizados en `assets/styles/tokens.css`** — activar la paleta de marca completa se hace tocando ese archivo y un par de clases, sin reescribir páginas.
- **Componentes aislados por clase** (`.hero`, `.card`, `.ecosystem`, `.asis-strip`, `.form-grid`…) — migran limpio a un design system o CMS por bloques.
- Reemplazar los `.placeholder-img` por fotografía real sin tocar la estructura.
- **Pendiente:** confirmar autorización de difusión de la base instalada de **ASIS IDTRAK** (son instalaciones del socio tecnológico, no clientes de Higienissa — encuadre ya incluido como disclaimer en `institucional.html`).
