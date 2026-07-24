// Seed de Firestore desde los JSON semilla en /content.
//
//   node scripts/seed.mjs --dry-run   # imprime lo que escribiría, sin tocar Firestore
//   node scripts/seed.mjs             # escribe en Firestore (necesita FIREBASE_SERVICE_ACCOUNT)
//
// Idempotente: usa el slug/id como ID de documento (set → overwrite). Convierte las páginas de
// secciones-nombradas a modelo de bloques (blocks[] = draft.blocks); marcas/sectores/legales/
// settings se escriben planos. Ver DB.md.

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DRY = process.argv.includes('--dry-run')
const read = (rel) => JSON.parse(readFileSync(join(ROOT, rel), 'utf8'))

// Carga mínima de .env (sin dependencia) para tomar FIREBASE_SERVICE_ACCOUNT al correr suelto.
function loadEnv() {
  const p = join(ROOT, '.env')
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}

// --- Fuentes ---
const PAGES = {
  home: 'content/pages/home.json',
  contacto: 'content/pages/contacto.json',
  institucional: 'content/pages/institucional.json',
  recursos: 'content/pages/recursos.json',
  articulo: 'content/pages/articulo.json',
}
const BRANDS = { pacifica: 'content/brands/pacifica.json', trazatex: 'content/brands/trazatex.json', operissa: 'content/brands/operissa.json' }
const SECTORS = { salud: 'content/sectors/salud.json', hoteleria: 'content/sectors/hoteleria.json', industria: 'content/sectors/industria.json', mineria: 'content/sectors/mineria.json' }
const LEGAL = { 'aviso-legal': 'content/legal/aviso-legal.json', privacidad: 'content/legal/privacidad.json' }

const PAGE_META = new Set(['id', 'slug', 'template', 'status', 'seo'])

// Página (secciones nombradas) → doc con blocks[] (= draft.blocks). block.type = clave de sección.
function pageToDoc(id, json) {
  const blocks = Object.entries(json)
    .filter(([k]) => !PAGE_META.has(k))
    .map(([type, data], i) => ({ id: type, type, order: i, data }))
  return {
    slug: json.slug || json.id || id,
    template: json.template || id,
    status: 'published',
    seo: json.seo || { title: { es: '', en: '' }, description: { es: '', en: '' } },
    blocks,
    draft: { blocks },
    publishedAt: stamp(),
    updatedAt: stamp(),
  }
}

function stamp() {
  return DRY ? '<serverTimestamp>' : FieldValue.serverTimestamp()
}

async function main() {
  const plan = [] // { ref: 'coll/id', summary }
  const writes = [] // { coll, id, data }

  const add = (coll, id, data, summary) => { plan.push(`${coll}/${id} — ${summary}`); writes.push({ coll, id, data }) }

  // settings/global
  add('settings', 'global', { ...read('content/settings.json'), updatedAt: stamp() }, 'ajustes del sitio')

  // pages/{id}  (modelo de bloques)
  for (const [id, rel] of Object.entries(PAGES)) {
    const doc = pageToDoc(id, read(rel))
    add('pages', id, doc, `${doc.blocks.length} bloques: ${doc.blocks.map((b) => b.type).join(', ')}`)
  }

  // brands/{slug}, sectors/{slug}  (docs planos)
  for (const [slug, rel] of Object.entries(BRANDS)) {
    add('brands', slug, { ...read(rel), published: true, updatedAt: stamp() }, 'marca')
  }
  for (const [slug, rel] of Object.entries(SECTORS)) {
    add('sectors', slug, { ...read(rel), published: true, updatedAt: stamp() }, 'sector')
  }

  // legalPages/{slug}
  for (const [slug, rel] of Object.entries(LEGAL)) {
    add('legalPages', slug, { ...read(rel), status: 'published', updatedAt: stamp() }, 'documento legal')
  }

  console.log(`\n${DRY ? '[DRY-RUN] ' : ''}Seed de Firestore — ${writes.length} documentos:\n`)
  for (const line of plan) console.log('  ·', line)

  if (DRY) {
    console.log('\n[DRY-RUN] No se escribió nada. Quita --dry-run para aplicar.\n')
    return
  }

  loadEnv()
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) {
    console.error('\n✖ Falta FIREBASE_SERVICE_ACCOUNT (en .env o el entorno). Aborto.\n')
    process.exit(1)
  }
  initializeApp({ credential: cert(JSON.parse(raw)) })
  const db = getFirestore()

  let n = 0
  for (const { coll, id, data } of writes) {
    await db.collection(coll).doc(id).set(data)
    n++
    console.log(`  ✔ ${coll}/${id}`)
  }
  console.log(`\n✔ Seed completo: ${n} documentos escritos.\n`)
}

main().catch((e) => { console.error(e); process.exit(1) })
