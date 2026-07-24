// Publicar contenido:
//  · publish(collection, id) — draft→published (páginas) vía CF publishPage + rebuild.
//  · rebuild() — solo dispara el rebuild de Vercel (colecciones planas: settings/brands/sectors,
//    que se editan en el doc en vivo y solo necesitan regenerar el SSG tras guardar).
export function usePublish() {
  async function callFn(name, payload) {
    const { app } = await useFirebase()
    const { getFunctions, httpsCallable } = await import('firebase/functions')
    const res = await httpsCallable(getFunctions(app), name)(payload)
    return res.data
  }

  const publish = (collection, id) => callFn('publishPage', { collection, id })
  const rebuild = () => callFn('rebuild', {})

  return { publish, rebuild }
}
