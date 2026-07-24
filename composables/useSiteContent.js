// Fuente de contenido del sitio público.
//
// Los loaders leen desde la API interna `/api/content/**` (server/api/content), que resuelve
// Firestore (Admin SDK) con fallback a los JSON semilla en /content. En SSG esto corre en
// build/prerender; el rebuild on-publish regenera con datos frescos. NO hay SDK de Firebase
// en el cliente y los JSON semilla ya no entran al bundle público (viven solo en el server).
//
// Todos los loaders son async: en las páginas se consumen con `await` (top-level en <script setup>).
// useAsyncData cachea por key y transfiere el payload SSR→cliente (sin refetch en hidratación).

export async function useSettings() {
  const { data } = await useAsyncData('content:settings', () => $fetch('/api/content/settings'))
  return data.value
}

export async function usePageContent(id) {
  const { data } = await useAsyncData(`content:page:${id}`, () => $fetch(`/api/content/pages/${id}`))
  if (!data.value) throw createError({ statusCode: 404, statusMessage: `Página no encontrada: ${id}` })
  return data.value
}

export async function useBrandContent(slug) {
  const { data } = await useAsyncData(`content:brand:${slug}`, () => $fetch(`/api/content/brands/${slug}`))
  if (!data.value) throw createError({ statusCode: 404, statusMessage: `Marca no encontrada: ${slug}` })
  return data.value
}

export async function useAllBrands() {
  const { data } = await useAsyncData('content:brands', () => $fetch('/api/content/brands'))
  return data.value || []
}

export async function useSectorContent(slug) {
  const { data } = await useAsyncData(`content:sector:${slug}`, () => $fetch(`/api/content/sectors/${slug}`))
  if (!data.value) throw createError({ statusCode: 404, statusMessage: `Sector no encontrado: ${slug}` })
  return data.value
}

export async function useAllSectors() {
  const { data } = await useAsyncData('content:sectors', () => $fetch('/api/content/sectors'))
  return data.value || []
}

export async function useLegalContent(slug) {
  const { data } = await useAsyncData(`content:legal:${slug}`, () => $fetch(`/api/content/legal/${slug}`))
  if (!data.value) throw createError({ statusCode: 404, statusMessage: `Documento legal no encontrado: ${slug}` })
  return data.value
}
