// Subida a Firebase Storage. Guarda en images/{pageId}/{blockId}/{uuid} y devuelve
// { url, path, width, height }. El bloque persiste esos datos (nunca la imagen en Firestore).
export function useStorage() {
  async function upload(file, { pageId = 'misc', blockId = 'block' } = {}) {
    const { storage } = await useFirebase()
    const { ref: sref, uploadBytes, getDownloadURL } = await import('firebase/storage')
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const uuid = crypto.randomUUID()
    const path = `images/${pageId}/${blockId}/${uuid}.${ext}`
    const r = sref(storage, path)
    const dims = await imageDims(file).catch(() => ({ width: null, height: null }))
    await uploadBytes(r, file, { contentType: file.type })
    const url = await getDownloadURL(r)
    return { url, path, ...dims }
  }

  function imageDims(file) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  return { upload }
}
