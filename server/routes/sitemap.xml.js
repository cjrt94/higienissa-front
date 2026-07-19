// Sitemap generado en build (SSG) y servido en /sitemap.xml.
// Enumera las rutas públicas indexables × locales (ES/EN) con alternates hreflang.
// Excluye: /admin/** (privado), y /soluciones (301 → /marca-trazatex).
// Rutas estáticas y conocidas: se listan aquí para no acoplar el sitemap al render de páginas.
const LOCALES = ['es', 'en']

// Path sin locale ('' = home). Mantener en sync al agregar/quitar páginas públicas.
const PATHS = [
  '',
  'institucional',
  'marca-pacifica',
  'marca-trazatex',
  'marca-operissa',
  'sector-salud',
  'sector-hoteleria',
  'sector-industria',
  'sector-mineria',
  'recursos',
  'articulo',
  'contacto',
  'aviso-legal',
  'privacidad',
]

export default defineEventHandler((event) => {
  const site = (process.env.NUXT_PUBLIC_SITE_URL || 'https://higienissa.com').replace(/\/$/, '')
  const loc = (locale, path) => `${site}/${locale}${path ? `/${path}` : ''}`

  const urls = PATHS.flatMap((path) =>
    LOCALES.map((locale) => {
      const alternates = [
        ...LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${loc(l, path)}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc('es', path)}"/>`,
      ].join('\n')
      return `  <url>\n    <loc>${loc(locale, path)}</loc>\n${alternates}\n  </url>`
    }),
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
