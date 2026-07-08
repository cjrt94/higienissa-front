// Firebase Admin (solo servidor). Se usa en rutas Nitro (p.ej. /api/contact) para escribir
// en Firestore sin exponer el SDK cliente en el sitio público.
import { getApps, initializeApp, cert, applicationDefault } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let _db = null

export function getAdminDb() {
  if (_db) return _db
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT
    if (raw) {
      const creds = JSON.parse(raw)
      initializeApp({ credential: cert(creds) })
    } else {
      // Fallback: credenciales por defecto del entorno (GOOGLE_APPLICATION_CREDENTIALS)
      initializeApp({ credential: applicationDefault() })
    }
  }
  _db = getFirestore()
  return _db
}
