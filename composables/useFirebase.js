// Acceso a Firebase SOLO en cliente y SOLO bajo /admin.
// Import dinámico → el SDK queda en un chunk async y NUNCA entra al bundle público (SSG/SEO limpio).
let _fb = null

export async function useFirebase() {
  if (import.meta.server) throw new Error('useFirebase es solo cliente (admin SPA)')
  if (_fb) return _fb

  const [{ initializeApp, getApps }, { getAuth }, { getFirestore }, { getStorage }] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
    import('firebase/storage'),
  ])

  const cfg = useRuntimeConfig().public.firebase
  if (!cfg.apiKey) console.warn('[firebase] falta NUXT_PUBLIC_FIREBASE_* en .env — el admin no podrá autenticar')

  const app = getApps().length ? getApps()[0] : initializeApp(cfg)
  _fb = { app, auth: getAuth(app), db: getFirestore(app), storage: getStorage(app) }
  return _fb
}
