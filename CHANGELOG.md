# Changelog — Grupo Higienissa · Wireframes

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) + [Semantic Versioning](https://semver.org/)

---

## [Unreleased]

- feat: heros más altos en todas las páginas (`.hero` a `clamp(64px, 8vw, 112px)` + `hero-grid min-height: 420px` + placeholder `tall` a 460px)
- feat: franja gris bajo el hero rediseñada con el patrón `intro-split` (texto a la izquierda + panel de destacados a la derecha) en home, las 3 marcas, soluciones y el "Contexto" de los 4 sectores
- feat: página **Nosotros** ampliada de 3 a 10 secciones — propósito, tesis del ecosistema (diagrama Procesa·Traza·Opera), qué integramos, sectores transversales y franja de respaldo ASIS IDTRAK (nombre enlazado a Trazatex)
- feat: `soluciones.html` enriquecida — nueva sección "El problema" (los textiles son activos) y "Cuatro capas" reconstruida como cards `.feature` (Capa 01–04 con detalle real: infraestructura de lectura, plataforma/KPIs)
- feat: secciones de sector con estructura real (`.marker-list` con variantes `ask`/`risk`/`gain` + indicadores como `chips`) en los 4 sectores — antes eran listas planas con clases inexistentes
- fix: doble numeración en "Cuatro capas" de soluciones — el `<ol class="steps">` mostraba el marcador nativo además del badge `.step-num`; resuelto con `list-style: none`
- fix: encabezado duplicado "Pensamos como operadores" en `marca-pacifica.html` — el `<h2>` de sección repetía el primer pilar; ahora es "Más que una lavandería tradicional"
- chore: nuevos componentes en `wireframe.css` (`intro-split`, `highlight-stack`/`highlight`, `marker-list`, `feature`) y paridad EN completa de todos los cambios
