<script setup>
definePageMeta({ layout: 'admin', pageTransition: false })
defineI18nRoute(false)
useHead({ title: 'Blog · Admin' })

const toast = useToast()
const { confirm } = useConfirm()
const { rebuild } = usePublish()

const posts = ref([])
const cats = ref([])
const loading = ref(true)
const err = ref('')
const editing = ref(null) // modelo de post en edición
const lang = ref('es')
const saving = ref(false)
const showCats = ref(false)
const newCat = ref({ es: '', en: '' })

const slugify = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

onMounted(load)

async function load() {
  loading.value = true
  try {
    const { db } = await useFirebase()
    const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
    const [pSnap, cSnap] = await Promise.all([
      getDocs(query(collection(db, 'posts'), orderBy('publishedAt', 'desc'))),
      getDocs(query(collection(db, 'postCategories'), orderBy('order'))),
    ])
    posts.value = pSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
    cats.value = cSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch {
    err.value = 'No se pudo cargar. Verificá Firebase en .env y el índice posts(status, publishedAt).'
  } finally {
    loading.value = false
  }
}

function blank() {
  return {
    id: null,
    slugEs: '', slugEn: '',
    title: { es: '', en: '' }, excerpt: { es: '', en: '' }, body: { es: '', en: '' },
    categoryRef: cats.value[0]?.id || '',
    coverImage: { url: '', alt: { es: '', en: '' } },
    author: { name: '', lastName: '' },
    status: 'draft',
    seo: { title: { es: '', en: '' }, description: { es: '', en: '' } },
  }
}

function create() { editing.value = blank() }
function edit(p) { editing.value = structuredClone(toRaw(p)) }

async function save(publishNow = false) {
  const e = editing.value
  if (!e.slugEs) e.slugEs = slugify(e.title.es)
  if (!e.slugEn) e.slugEn = slugify(e.title.en || e.title.es)
  if (!e.slugEs) { toast.error('Falta el título (ES) para generar el slug.'); return false }
  saving.value = true
  try {
    const { db } = await useFirebase()
    const { doc: dref, setDoc, serverTimestamp } = await import('firebase/firestore')
    const cat = cats.value.find((c) => c.id === e.categoryRef)
    const status = publishNow ? 'published' : e.status
    const payload = {
      slugEs: e.slugEs, slugEn: e.slugEn,
      title: e.title, excerpt: e.excerpt, body: e.body,
      categoryRef: e.categoryRef,
      categorySummary: cat ? { id: cat.id, name: cat.name, slug: cat.slug } : null,
      coverImage: e.coverImage,
      author: e.author,
      status,
      seo: e.seo,
      updatedAt: serverTimestamp(),
    }
    // Sella publishedAt la primera vez que se publica.
    if (status === 'published' && !e.publishedAt) payload.publishedAt = serverTimestamp()
    await setDoc(dref(db, 'posts', e.slugEs), payload, { merge: true })
    // Reflejar en la lista local sin refetch.
    const idx = posts.value.findIndex((p) => p.id === e.slugEs)
    const local = { id: e.slugEs, ...payload, publishedAt: e.publishedAt || null }
    if (idx >= 0) posts.value[idx] = local; else posts.value.unshift(local)
    e.id = e.slugEs
    e.status = status
    toast.success(publishNow ? 'Publicado.' : 'Guardado.')
    return true
  } catch {
    toast.error('No se pudo guardar el artículo.')
    return false
  } finally {
    saving.value = false
  }
}

async function publish() {
  const ok = await confirm({ title: 'Publicar artículo', message: 'Se publicará y se disparará el rebuild del sitio. ¿Continuar?', confirmText: 'Publicar' })
  if (!ok) return
  if (await save(true)) {
    try { await rebuild(); toast.success('El sitio se está reconstruyendo.') } catch { toast.error('Publicado, pero falló el rebuild.') }
  }
}

async function remove(p) {
  const ok = await confirm({ title: 'Eliminar artículo', message: `¿Eliminar "${p.title?.es}"? No se puede deshacer.`, confirmText: 'Eliminar', danger: true })
  if (!ok) return
  try {
    const { db } = await useFirebase()
    const { doc: dref, deleteDoc } = await import('firebase/firestore')
    await deleteDoc(dref(db, 'posts', p.id))
    posts.value = posts.value.filter((x) => x.id !== p.id)
    if (editing.value?.id === p.id) editing.value = null
    toast.success('Artículo eliminado.')
  } catch { toast.error('No se pudo eliminar.') }
}

async function addCategory() {
  const es = newCat.value.es.trim()
  if (!es) return
  const id = slugify(es)
  try {
    const { db } = await useFirebase()
    const { doc: dref, setDoc, serverTimestamp } = await import('firebase/firestore')
    const en = newCat.value.en.trim() || es
    const data = { name: { es, en }, slug: { es: slugify(es), en: slugify(en) }, order: cats.value.length, updatedAt: serverTimestamp() }
    await setDoc(dref(db, 'postCategories', id), data, { merge: true })
    if (!cats.value.find((c) => c.id === id)) cats.value.push({ id, ...data })
    newCat.value = { es: '', en: '' }
    toast.success('Categoría creada.')
  } catch { toast.error('No se pudo crear la categoría.') }
}

async function removeCategory(c) {
  if (posts.value.some((p) => p.categoryRef === c.id)) { toast.error('Hay artículos en esta categoría. Reasignalos primero.'); return }
  const ok = await confirm({ title: 'Eliminar categoría', message: `¿Eliminar "${c.name?.es}"?`, confirmText: 'Eliminar', danger: true })
  if (!ok) return
  try {
    const { db } = await useFirebase()
    const { doc: dref, deleteDoc } = await import('firebase/firestore')
    await deleteDoc(dref(db, 'postCategories', c.id))
    cats.value = cats.value.filter((x) => x.id !== c.id)
    toast.success('Categoría eliminada.')
  } catch { toast.error('No se pudo eliminar la categoría.') }
}
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px">
      <h1 style="margin:0">Blog</h1>
      <div style="display:flex;gap:8px">
        <button v-if="editing" class="admin-btn ghost small" @click="editing = null">← Volver</button>
        <template v-else>
          <button class="admin-btn ghost small" @click="showCats = !showCats">Categorías</button>
          <button class="admin-btn small" @click="create">+ Nuevo artículo</button>
        </template>
      </div>
    </div>

    <p v-if="loading" style="color:#7a8190">Cargando…</p>
    <div v-else-if="err" class="admin-card">{{ err }}</div>

    <template v-else>
      <!-- Gestor de categorías -->
      <div v-if="showCats && !editing" class="admin-card" style="margin-bottom:16px">
        <b style="display:block;margin-bottom:12px">Categorías</b>
        <div v-for="c in cats" :key="c.id" class="admin-row">
          <div class="meta"><b>{{ c.name?.es }}</b><small>{{ c.id }}</small></div>
          <button class="admin-btn ghost small danger" @click="removeCategory(c)">Eliminar</button>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
          <input v-model="newCat.es" type="text" placeholder="Nombre (ES)" style="flex:1;min-width:120px">
          <input v-model="newCat.en" type="text" placeholder="Name (EN)" style="flex:1;min-width:120px">
          <button class="admin-btn small" @click="addCategory">Agregar</button>
        </div>
      </div>

      <!-- Lista -->
      <div v-if="!editing" class="admin-list">
        <div v-if="!posts.length" class="admin-card">Nada aún. Corré <code>npm run seed</code> o creá un artículo.</div>
        <div v-for="p in posts" :key="p.id" class="admin-row">
          <div class="meta" style="cursor:pointer" @click="edit(p)">
            <b>{{ p.title?.es }}</b>
            <small>{{ p.categorySummary?.name?.es || p.categoryRef }} · {{ p.slugEs }}</small>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <span class="badge-status" :class="p.status === 'published' ? 'published' : 'draft'">{{ p.status }}</span>
            <button class="admin-btn ghost small" @click="edit(p)">Editar</button>
            <button class="admin-btn ghost small danger" @click="remove(p)">Eliminar</button>
          </div>
        </div>
      </div>

      <!-- Editor -->
      <div v-else>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap">
          <div class="lang-tabs">
            <button :class="{ active: lang === 'es' }" @click="lang = 'es'">ES</button>
            <button :class="{ active: lang === 'en' }" @click="lang = 'en'">EN</button>
          </div>
          <div style="display:flex;gap:10px">
            <button class="admin-btn ghost" :disabled="saving" @click="save(false)">Guardar borrador</button>
            <button class="admin-btn" :disabled="saving" @click="publish">Publicar</button>
          </div>
        </div>

        <div class="admin-card" style="display:grid;gap:14px">
          <div class="admin-field">
            <label>Título ({{ lang.toUpperCase() }})</label>
            <input v-model="editing.title[lang]" type="text" maxlength="120">
          </div>
          <div class="admin-field">
            <label>Extracto ({{ lang.toUpperCase() }})</label>
            <textarea v-model="editing.excerpt[lang]" rows="2" maxlength="300" />
          </div>
          <div class="admin-field">
            <label>Cuerpo ({{ lang.toUpperCase() }}) · separá párrafos con una línea en blanco</label>
            <textarea v-model="editing.body[lang]" rows="10" />
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
            <div class="admin-field">
              <label>Slug ES</label>
              <input v-model="editing.slugEs" type="text" placeholder="se genera del título">
            </div>
            <div class="admin-field">
              <label>Slug EN</label>
              <input v-model="editing.slugEn" type="text" placeholder="se genera del título">
            </div>
            <div class="admin-field">
              <label>Categoría</label>
              <select v-model="editing.categoryRef">
                <option v-for="c in cats" :key="c.id" :value="c.id">{{ c.name?.es }}</option>
              </select>
            </div>
            <div class="admin-field">
              <label>Estado</label>
              <select v-model="editing.status">
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
            <div class="admin-field">
              <label>Autor · nombre</label>
              <input v-model="editing.author.name" type="text" maxlength="40">
            </div>
            <div class="admin-field">
              <label>Autor · apellido</label>
              <input v-model="editing.author.lastName" type="text" maxlength="40">
            </div>
          </div>
          <div class="admin-field">
            <label>Imagen de portada</label>
            <ImageUploader v-model="editing.coverImage.url" page-id="posts" :block-id="editing.slugEs || 'nuevo'" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
