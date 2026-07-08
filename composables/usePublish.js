// Publicar un doc (draft→published) vía Cloud Function publishPage, que además dispara el rebuild.
export function usePublish() {
  async function publish(collection, id) {
    const { app } = await useFirebase()
    const { getFunctions, httpsCallable } = await import('firebase/functions')
    const fns = getFunctions(app)
    const call = httpsCallable(fns, 'publishPage')
    const res = await call({ collection, id })
    return res.data
  }
  return { publish }
}
