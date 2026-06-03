# 01 · Sitemap, navegación global y footer

Modelo: **un solo sitio con subpáginas**, bilingüe `/es/` y `/en/`.

## Mapa del sitio

```
/ (Inicio · Home corporativa — Grupo Higienissa)
├── /nosotros            (institucional del grupo: el ecosistema, propósito)
├── /pacifica            (Home de marca)
│     ├── /pacifica/soluciones
│     ├── /pacifica/sectores
│     ├── /pacifica/diferencia
│     └── /pacifica/contacto
├── /trazatex            (Home de marca)
│     ├── /trazatex/soluciones
│     ├── /trazatex/sectores         (Salud · Hotelería · Industria)
│     ├── /trazatex/nosotros         (incluye respaldo ASIS IDTRAK)
│     ├── /trazatex/recursos
│     └── /trazatex/contacto
├── /operissa            (Home de marca)
│     ├── /operissa/soluciones
│     ├── /operissa/sectores
│     ├── /operissa/metodologia
│     ├── /operissa/diferencia
│     └── /operissa/contacto
├── /sectores            (transversal del grupo)
│     ├── /sectores/salud
│     ├── /sectores/hoteleria
│     ├── /sectores/industria
│     └── /sectores/mineria          (solo Pacífica + Operissa)
├── /recursos            (blog del grupo)
│     └── /recursos/[articulo]
└── /contacto
```

**Notas**
- Para wireframes basta **una página por plantilla** (no hay que generar las ~25 páginas). Las subpáginas de marca comparten plantilla; representar con una variante (ej. `marca-pacifica.html`, una `soluciones.html`, una `sector.html`).
- Minería: incluir en `/sectores/mineria` y en Pacífica/Operissa; **no** en Trazatex.
- Todo el árbol se duplica bajo `/en/`.

## Navegación global (header, en todas las páginas)

Orden del menú principal:

`Inicio` · `Pacífica` · `Trazatex` · `Operissa` · `Sectores` · `Nosotros` · `Recursos` · **`Contacto`** (botón) · **`ES | EN`** (selector)

- Logo (lockup horizontal) a la izquierda → enlaza a Inicio.
- `Pacífica/Trazatex/Operissa`: idealmente con submenú (Soluciones, Sectores, Diferencia/Metodología, Contacto). En wireframe basta indicar el dropdown.
- `Contacto` como botón de acción destacado.
- Header fijo/persistente; mismo menú en cualquier marca o idioma.

## Bloque "Ecosistema" (cruces entre marcas)

Presente en cada Home de marca y donde el servicio se complemente:
- **Pacífica** → enlaza a **Trazatex** (trazabilidad/RFID) y **Operissa** (operación in situ).
- **Trazatex** → enlaza a **Pacífica** y **Operissa** (su tecnología se integra en ambas) + respaldo **ASIS IDTRAK**.
- **Operissa** → enlaza a **Pacífica** y **Trazatex**.

## Footer (global)

Columnas sugeridas:
1. **Marca** — logo + descriptor de una línea + selector de idioma.
2. **Ecosistema** — Pacífica · Trazatex · Operissa.
3. **Sectores** — Salud · Hotelería · Industria · Minería.
4. **Recursos / Empresa** — Nosotros · Recursos/Blog · Contacto.
5. **Contacto** — placeholder de email/teléfono/ubicación + nota "En alianza tecnológica con ASIS IDTRAK (España)".
- Barra inferior: © Grupo Higienissa · aviso legal / privacidad (placeholders).
