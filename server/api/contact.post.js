import { FieldValue } from 'firebase-admin/firestore'
import { contactSchema } from '~/schemas/contact.js'
import es from '~/locales/es.json'
// getAdminDb se auto-importa desde server/utils/firebaseAdmin.js

// Traductor mínimo sobre el locale ES para los mensajes de validación del server
// (mismo registro "usted" que el cliente en ES). Soporta interpolación {n}.
const t = (key, params) => {
  let s = key.split('.').reduce((o, k) => (o == null ? o : o[k]), es)
  if (typeof s !== 'string') return key
  if (params) for (const p in params) s = s.replace(`{${p}}`, params[p])
  return s
}

// Recibe el formulario de contacto, valida con Zod (misma fuente que el cliente)
// y escribe en Firestore contactSubmissions vía firebase-admin (sin SDK en el bundle público).
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = contactSchema(t).safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Datos inválidos', data: parsed.error.flatten() })
  }
  const data = parsed.data

  try {
    const db = getAdminDb()
    await db.collection('contactSubmissions').add({
      name: data.name,
      lastName: data.lastName,
      position: data.position || '',
      company: data.company,
      sector: data.sector,
      email: data.email,
      message: data.message,
      ctaContext: data.ctaContext,
      locale: body.locale === 'en' ? 'en' : 'es',
      consent: data.consent,
      status: 'new',
      source: 'web-contact',
      createdAt: FieldValue.serverTimestamp(),
    })
    return { ok: true }
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'No se pudo registrar la solicitud' })
  }
})
