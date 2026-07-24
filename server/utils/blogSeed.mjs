// Derivación pura (sin Firebase ni globals de Nuxt) de posts + categorías del blog a partir
// del JSON semilla `content/pages/recursos.json`. La usan tanto el fallback del servidor
// (server/utils/content.js) como el seed (scripts/seed.mjs), para no duplicar la lógica.

export function slugify(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function derivePostsAndCategories(recursos) {
  const items = recursos?.posts?.items || []
  const catMap = new Map()

  const posts = items.map((p, i) => {
    const catEs = p.category?.es || 'General'
    const catEn = p.category?.en || catEs
    const categoryRef = slugify(catEs)
    if (!catMap.has(categoryRef)) {
      catMap.set(categoryRef, {
        id: categoryRef,
        name: { es: catEs, en: catEn },
        slug: { es: slugify(catEs), en: slugify(catEn) },
        order: catMap.size,
      })
    }
    const slugEs = slugify(p.title?.es || `post-${i + 1}`)
    const slugEn = slugify(p.title?.en || p.title?.es || `post-${i + 1}`)
    const categorySummary = { id: categoryRef, name: { es: catEs, en: catEn }, slug: { es: slugify(catEs), en: slugify(catEn) } }

    return {
      id: slugEs,
      slugEs,
      slugEn,
      title: p.title || { es: '', en: '' },
      excerpt: p.excerpt || { es: '', en: '' },
      body: {
        es: p.excerpt?.es ? `${p.excerpt.es}\n\n(Contenido de ejemplo — editá este artículo desde el panel de administración.)` : '',
        en: p.excerpt?.en ? `${p.excerpt.en}\n\n(Sample content — edit this article from the admin panel.)` : '',
      },
      categoryRef,
      categorySummary,
      coverImage: { url: p.image || '', alt: p.imageAlt || { es: '', en: '' } },
      author: { name: 'Grupo', lastName: 'Higienissa' },
      status: 'published',
      order: i,
      date: p.date || null,
      seo: { title: p.title || { es: '', en: '' }, description: p.excerpt || { es: '', en: '' } },
    }
  })

  return { posts, categories: [...catMap.values()] }
}
