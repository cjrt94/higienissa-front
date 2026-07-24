// Sitemap generado en build (SSG) y servido en /sitemap.xml.
// Enumera las rutas públicas indexables × locales (ES/EN) con alternates hreflang.
// Excluye: /admin/** (privado), y /soluciones (301 → /marca-trazatex).
// Los artículos del blog se leen de Firestore (fallback a los posts semilla) con slug por locale.
import { getPosts } from '../utils/content'

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
  'contacto',
  'aviso-legal',
  'privacidad',
]

export default defineEventHandler(async (event) => {
  const site = (process.env.NUXT_PUBLIC_SITE_URL || 'https://higienissa.com').replace(/\/$/, '')
  const loc = (locale, path) => `${site}/${locale}${path ? `/${path}` : ''}`

  const staticUrls = PATHS.flatMap((path) =>
    LOCALES.map((locale) => {
      const alternates = [
        ...LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${loc(l, path)}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc('es', path)}"/>`,
      ].join('\n')
      return `  <url>\n    <loc>${loc(locale, path)}</loc>\n${alternates}\n  </url>`
    }),
  )

  // Artículos del blog: slug propio por locale, cada par es↔en como alternate.
  const posts = await getPosts().catch(() => [])
  const postUrls = posts.flatMap((p) => {
    const esUrl = `${site}/es/recursos/${p.slugEs}`
    const enUrl = `${site}/en/recursos/${p.slugEn || p.slugEs}`
    const alternates = [
      `    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${esUrl}"/>`,
    ].join('\n')
    return [
      `  <url>\n    <loc>${esUrl}</loc>\n${alternates}\n  </url>`,
      `  <url>\n    <loc>${enUrl}</loc>\n${alternates}\n  </url>`,
    ]
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...staticUrls, ...postUrls].join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
