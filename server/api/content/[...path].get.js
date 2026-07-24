// API de contenido del sitio público. Lee Firestore (Admin SDK) con fallback a JSON semilla.
// Se ejecuta en build/prerender (SSG) y en server; nunca expone el SDK cliente al público.
//
//   GET /api/content/settings
//   GET /api/content/pages/:id
//   GET /api/content/brands            · GET /api/content/brands/:slug
//   GET /api/content/sectors           · GET /api/content/sectors/:slug
//   GET /api/content/legal/:slug

import { getSettings, getPage, getBrand, getBrands, getSector, getSectors, getLegal } from '../../utils/content'

function found(value, what) {
  if (value == null) throw createError({ statusCode: 404, statusMessage: `${what} no encontrado` })
  return value
}

export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'path') || ''
  const [type, slug] = raw.split('/').filter(Boolean)

  switch (type) {
    case 'settings':
      return await getSettings()
    case 'pages':
      return found(await getPage(slug), `Página "${slug}"`)
    case 'brands':
      return slug ? found(await getBrand(slug), `Marca "${slug}"`) : await getBrands()
    case 'sectors':
      return slug ? found(await getSector(slug), `Sector "${slug}"`) : await getSectors()
    case 'legal':
      return found(await getLegal(slug), `Documento legal "${slug}"`)
    default:
      throw createError({ statusCode: 404, statusMessage: 'Contenido no encontrado' })
  }
})
