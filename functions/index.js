// Cloud Functions gen2 — Grupo Higienissa
// · publishPage  : draft → published + dispara rebuild de Vercel (Deploy Hook)
// · denormalización: postCategories.postCount + propagación de categorySummary a posts
const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { onDocumentWritten } = require('firebase-functions/v2/firestore')
const { defineSecret } = require('firebase-functions/params')
const logger = require('firebase-functions/logger')
const admin = require('firebase-admin')

admin.initializeApp()
const db = admin.firestore()

const VERCEL_DEPLOY_HOOK = defineSecret('VERCEL_DEPLOY_HOOK')

async function requireEditor(auth) {
  if (!auth?.uid) throw new HttpsError('unauthenticated', 'Se requiere iniciar sesión.')
  const prof = (await db.doc(`users/${auth.uid}`).get()).data()
  if (!prof?.active || !['admin', 'editor'].includes(prof.role)) {
    throw new HttpsError('permission-denied', 'Solo editor/admin.')
  }
  return prof
}

async function triggerRebuild(hookUrl) {
  if (!hookUrl) { logger.warn('Sin VERCEL_DEPLOY_HOOK: se publicó pero no se disparó rebuild.'); return }
  try {
    await fetch(hookUrl, { method: 'POST' })
    logger.info('Rebuild de Vercel disparado.')
  } catch (e) {
    logger.error('Fallo al disparar rebuild de Vercel', e)
  }
}

// Publicar: mueve draft → published en el mismo doc y dispara el rebuild (SSG).
exports.publishPage = onCall({ secrets: [VERCEL_DEPLOY_HOOK] }, async (req) => {
  await requireEditor(req.auth)
  const { collection = 'pages', id } = req.data || {}
  if (!id) throw new HttpsError('invalid-argument', 'Falta id.')

  const ref = db.doc(`${collection}/${id}`)
  const snap = await ref.get()
  if (!snap.exists) throw new HttpsError('not-found', 'Documento no encontrado.')

  const data = snap.data()
  const update = { status: 'published', publishedAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() }
  if (data.draft?.blocks) update.blocks = data.draft.blocks
  await ref.set(update, { merge: true })

  await triggerRebuild(VERCEL_DEPLOY_HOOK.value())
  return { ok: true }
})

// Denormalización: mantener postCategories.postCount al escribir posts.
exports.onPostWritten = onDocumentWritten('posts/{postId}', async (event) => {
  const before = event.data?.before?.data()
  const after = event.data?.after?.data()
  const cats = new Set()
  if (before?.categoryRef) cats.add(before.categoryRef)
  if (after?.categoryRef) cats.add(after.categoryRef)

  for (const catId of cats) {
    const count = (await db.collection('posts')
      .where('categoryRef', '==', catId)
      .where('status', '==', 'published')
      .count().get()).data().count
    await db.doc(`postCategories/${catId}`).set({ postCount: count }, { merge: true })
  }
})

// Propagar cambios de nombre/slug de categoría al summary denormalizado de cada post.
exports.onCategoryWritten = onDocumentWritten('postCategories/{catId}', async (event) => {
  const after = event.data?.after?.data()
  if (!after) return
  const catId = event.params.catId
  const summary = { id: catId, name: after.name, slug: after.slug }
  const posts = await db.collection('posts').where('categoryRef', '==', catId).get()
  const batch = db.batch()
  posts.forEach((p) => batch.set(p.ref, { categorySummary: summary }, { merge: true }))
  if (!posts.empty) await batch.commit()
})
