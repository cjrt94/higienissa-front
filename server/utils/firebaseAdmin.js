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
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Fallback: credenciales por defecto del entorno (GOOGLE_APPLICATION_CREDENTIALS)
      initializeApp({ credential: applicationDefault() })
    } else {
      // Sin credenciales (típico en local sin Firebase): NO invocar applicationDefault(),
      // que en una máquina fuera de GCP intenta el metadata server (169.254.169.254) y
      // cuelga ~8 s por lectura antes de fallar. Lanzamos: los loaders de content.js
      // atrapan el error y caen al JSON semilla al instante (arranque seguro y rápido).
      throw new Error('Firebase Admin sin credenciales (FIREBASE_SERVICE_ACCOUNT/GOOGLE_APPLICATION_CREDENTIALS) — usando seed')
    }
  }
  _db = getFirestore()
  return _db
}
