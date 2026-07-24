// Capa de contenido del sitio público (solo servidor).
//
// Lee de Firestore con el Admin SDK (getAdminDb) y, si Firebase no está configurado
// o la colección está vacía, cae a los JSON semilla en /content. Así el sitio sigue
// funcionando aunque el back office aún no esté conectado (arranque seguro).
//
// Los JSON se importan solo aquí (servidor) → nunca entran al bundle del cliente.
// Las páginas usan el modelo de bloques en Firestore; este módulo los "pliega" a la
// forma con secciones nombradas (page.hero, page.groupIntro, …) que consumen las
// plantillas — que NO cambian de forma.

import settings from '../../content/settings.json'
import home from '../../content/pages/home.json'
import contacto from '../../content/pages/contacto.json'
import institucional from '../../content/pages/institucional.json'
import recursos from '../../content/pages/recursos.json'
import articulo from '../../content/pages/articulo.json'
import pacifica from '../../content/brands/pacifica.json'
import trazatex from '../../content/brands/trazatex.json'
import operissa from '../../content/brands/operissa.json'
import salud from '../../content/sectors/salud.json'
import hoteleria from '../../content/sectors/hoteleria.json'
import industria from '../../content/sectors/industria.json'
import mineria from '../../content/sectors/mineria.json'
import avisoLegal from '../../content/legal/aviso-legal.json'
import privacidad from '../../content/legal/privacidad.json'

const SEED = {
  settings,
  pages: { home, contacto, institucional, recursos, articulo },
  brands: { pacifica, trazatex, operissa },
  sectors: { salud, hoteleria, industria, mineria },
  legal: { 'aviso-legal': avisoLegal, privacidad },
}

// blocks[] → { hero:{…}, groupIntro:{…}, … } (clave = block.type)
function foldBlocks(blocks = []) {
  return [...blocks]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .reduce((acc, b) => { if (b?.type) acc[b.type] = b.data; return acc }, {})
}

// Doc Firestore de página → forma plana que esperan las plantillas (page.hero, page.seo, …)
function pageFromDoc(data) {
  const blocks = data.blocks || []
  if (!blocks.length) return data // edge: doc sin bloques → devolver tal cual
  return {
    id: data.slug,
    slug: data.slug,
    template: data.template,
    status: data.status,
    seo: data.seo || {},
    ...foldBlocks(blocks),
  }
}

// Lectura defensiva: si Firebase no está configurado o falla, devuelve null (→ fallback semilla).
async function readDoc(coll, id) {
  try {
    const snap = await getAdminDb().collection(coll).doc(id).get()
    if (snap.exists) return snap.data()
  } catch { /* Firebase no configurado o error de red → fallback */ }
  return null
}

async function readPublished(coll) {
  try {
    const snap = await getAdminDb().collection(coll).where('published', '==', true).orderBy('order').get()
    if (!snap.empty) return snap.docs.map((d) => d.data())
  } catch { /* falta índice, sin config, o vacío → fallback */ }
  return null
}

export async function getSettings() {
  return (await readDoc('settings', 'global')) || SEED.settings
}

export async function getPage(id) {
  const doc = await readDoc('pages', id)
  if (doc && doc.status === 'published') return pageFromDoc(doc)
  return SEED.pages[id] || null
}

export async function getBrand(slug) {
  const doc = await readDoc('brands', slug)
  if (doc && doc.published !== false) return doc
  return SEED.brands[slug] || null
}

export async function getBrands() {
  return (
    (await readPublished('brands')) ||
    Object.values(SEED.brands)
      .filter((b) => b.published !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  )
}

export async function getSector(slug) {
  const doc = await readDoc('sectors', slug)
  if (doc && doc.published !== false) return doc
  return SEED.sectors[slug] || null
}

export async function getSectors() {
  return (
    (await readPublished('sectors')) ||
    Object.values(SEED.sectors)
      .filter((s) => s.published !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  )
}

export async function getLegal(slug) {
  const doc = await readDoc('legalPages', slug)
  if (doc) return doc
  return SEED.legal[slug] || null
}
