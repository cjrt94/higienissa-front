// Fuente de contenido del sitio público.
//
// Lee los JSON semilla en /content (build-time, SSG, sin SDK de Firebase en cliente).
// El mismo shape ({ es, en } por campo) vive en Firestore `pages/{id}`; al conectar el admin
// se reemplaza SOLO la implementación de estos loaders — los componentes no cambian.
//
// Se importan como texto crudo (?raw) + JSON.parse para evitar el transform de JSON de Vite
// (que en este entorno lanza "orgTransform.apply is not a function").

import settingsRaw from '../content/settings.json?raw'

import homeRaw from '../content/pages/home.json?raw'
import contactoRaw from '../content/pages/contacto.json?raw'
import solucionesRaw from '../content/pages/soluciones.json?raw'
import institucionalRaw from '../content/pages/institucional.json?raw'
import recursosRaw from '../content/pages/recursos.json?raw'
import articuloRaw from '../content/pages/articulo.json?raw'
import creditosRaw from '../content/pages/creditos.json?raw'

import pacificaRaw from '../content/brands/pacifica.json?raw'
import trazatexRaw from '../content/brands/trazatex.json?raw'
import operissaRaw from '../content/brands/operissa.json?raw'

import saludRaw from '../content/sectors/salud.json?raw'
import hoteleriaRaw from '../content/sectors/hoteleria.json?raw'
import industriaRaw from '../content/sectors/industria.json?raw'
import mineriaRaw from '../content/sectors/mineria.json?raw'

import avisoLegalRaw from '../content/legal/aviso-legal.json?raw'
import privacidadRaw from '../content/legal/privacidad.json?raw'

const P = (s) => JSON.parse(s)
const settings = P(settingsRaw)
const pages = {
  home: P(homeRaw), contacto: P(contactoRaw), soluciones: P(solucionesRaw),
  institucional: P(institucionalRaw), recursos: P(recursosRaw), articulo: P(articuloRaw), creditos: P(creditosRaw),
}
const brands = { pacifica: P(pacificaRaw), trazatex: P(trazatexRaw), operissa: P(operissaRaw) }
const sectors = { salud: P(saludRaw), hoteleria: P(hoteleriaRaw), industria: P(industriaRaw), mineria: P(mineriaRaw) }
const legal = { 'aviso-legal': P(avisoLegalRaw), privacidad: P(privacidadRaw) }

export function useSettings() {
  return settings
}

export function usePageContent(id) {
  const page = pages[id]
  if (!page) throw createError({ statusCode: 404, statusMessage: `Página no encontrada: ${id}` })
  return page
}

export function useBrandContent(slug) {
  const brand = brands[slug]
  if (!brand) throw createError({ statusCode: 404, statusMessage: `Marca no encontrada: ${slug}` })
  return brand
}

export function useSectorContent(slug) {
  const sector = sectors[slug]
  if (!sector) throw createError({ statusCode: 404, statusMessage: `Sector no encontrado: ${slug}` })
  return sector
}

export function useAllSectors() {
  return Object.values(sectors).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export function useAllBrands() {
  return Object.values(brands).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export function useLegalContent(slug) {
  const doc = legal[slug]
  if (!doc) throw createError({ statusCode: 404, statusMessage: `Documento legal no encontrado: ${slug}` })
  return doc
}
