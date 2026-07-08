// Estado de autenticación del admin (patrón Fiasco portado a JS).
// Rol en Firestore users/{uid} (NO custom claims). Un solo onAuthStateChanged (init()).
export function useAuth() {
  const user = useState('auth.user', () => null)        // firebase user
  const profile = useState('auth.profile', () => null)  // users/{uid}
  const ready = useState('auth.ready', () => false)     // resolvió el primer estado

  const isAuthed = computed(() => !!user.value && !!profile.value?.active)
  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isEditor = computed(() => ['admin', 'editor'].includes(profile.value?.role))

  async function init() {
    if (import.meta.server) return
    const { auth, db } = await useFirebase()
    const { onAuthStateChanged } = await import('firebase/auth')
    const { doc, getDoc } = await import('firebase/firestore')
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (u) => {
        user.value = u
        if (u) {
          const snap = await getDoc(doc(db, 'users', u.uid))
          profile.value = snap.exists() ? { id: u.uid, ...snap.data() } : null
        } else {
          profile.value = null
        }
        ready.value = true
        resolve()
      })
    })
  }

  async function login(email, password) {
    const { auth } = await useFirebase()
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    const { auth } = await useFirebase()
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
  }

  return { user, profile, ready, isAuthed, isAdmin, isEditor, init, login, logout }
}
