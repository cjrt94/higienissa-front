import { FieldValue } from 'firebase-admin/firestore'
import { contactSchema } from '~/schemas/contact.js'
// getAdminDb se auto-importa desde server/utils/firebaseAdmin.js

// Recibe el formulario de contacto, valida con Zod (misma fuente que el cliente)
// y escribe en Firestore contactSubmissions vía firebase-admin (sin SDK en el bundle público).
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = contactSchema.safeParse(body)
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
