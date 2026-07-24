<script setup>
// Editor de colección plana (marcas, sectores): lista → editar doc completo con AdminObjectEditor
// → Guardar (setDoc merge en el doc en vivo) → Publicar (guardar + rebuild). Sin draft/blocks.
// Mutación local in-place tras guardar (sin refetch).
defineOptions({ name: 'AdminCollectionEditor' })
const props = defineProps({
  collection: { type: String, required: true }, // 'brands' | 'sectors'
  title: { type: String, required: true },
  // Campos meta que no se editan con el object editor (se conservan/gestionan aparte).
  meta: { type: Array, default: () => ['updatedAt', 'publishedAt'] },
})

const toast = useToast()
const { confirm } = useConfirm()
const { rebuild } = usePublish()

const items = ref([])
const loading = ref(true)
const err = ref('')
const editing = ref(null) // { id, model, published }
const lang = ref('es')
const saving = ref(false)

onMounted(load)

async function load() {
  loading.value = true
  try {
    const { db } = await useFirebase()
    const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
    const snap = await getDocs(query(collection(db, props.collection), orderBy('order')))
    items.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch {
    err.value = `No se pudo cargar "${props.collection}". Verificá Firebase en .env.`
  } finally {
    loading.value = false
  }
}

function edit(item) {
  const model = structuredClone(toRaw(item))
  const id = model.id
  delete model.id
  const published = model.published !== false
  delete model.published
  for (const k of props.meta) delete model[k]
  editing.value = { id, model, published }
}

async function save() {
  if (!editing.value) return false
  saving.value = true
  try {
    const { db } = await useFirebase()
    const { doc: dref, setDoc, serverTimestamp } = await import('firebase/firestore')
    const payload = { ...editing.value.model, published: editing.value.published, updatedAt: serverTimestamp() }
    await setDoc(dref(db, props.collection, editing.value.id), payload, { merge: true })
    // Reflejar en la lista local sin refetch.
    const i = items.value.findIndex((x) => x.id === editing.value.id)
    if (i >= 0) items.value[i] = { id: editing.value.id, ...items.value[i], ...payload, updatedAt: null }
    toast.success('Guardado.')
    return true
  } catch {
    toast.error('No se pudo guardar.')
    return false
  } finally {
    saving.value = false
  }
}

async function publish() {
  const ok = await confirm({ title: 'Publicar', message: 'Se guardará y se disparará el rebuild del sitio. ¿Continuar?', confirmText: 'Publicar' })
  if (!ok) return
  saving.value = true
  try {
    if (await save()) {
      await rebuild()
      toast.success('Publicado. El sitio se está reconstruyendo.')
    }
  } catch {
    toast.error('No se pudo publicar (revisá la Cloud Function rebuild).')
  } finally {
    saving.value = false
  }
}

const nameOf = (item) => (typeof item.name === 'string' ? item.name : item.name?.es) || item.slug || item.id
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px">
      <h1 style="margin:0">{{ title }}</h1>
      <button v-if="editing" class="admin-btn ghost small" @click="editing = null">← Volver a la lista</button>
    </div>

    <p v-if="loading" style="color:#7a8190">Cargando…</p>
    <div v-else-if="err" class="admin-card">{{ err }}</div>

    <!-- Lista -->
    <div v-else-if="!editing" class="admin-list">
      <div v-if="!items.length" class="admin-card">Nada aún. Corré <code>npm run seed</code> para poblar Firestore.</div>
      <div v-for="it in items" :key="it.id" class="admin-row">
        <div class="meta">
          <b>{{ nameOf(it) }}</b>
          <small>{{ it.id }}</small>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <span class="badge-status" :class="it.published === false ? 'draft' : 'published'">{{ it.published === false ? 'oculto' : 'publicado' }}</span>
          <button class="admin-btn ghost small" @click="edit(it)">Editar</button>
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
        <label style="display:flex;gap:6px;align-items:center;font-size:.9rem">
          <input v-model="editing.published" type="checkbox"> Publicada (visible en el sitio)
        </label>
        <div style="display:flex;gap:10px">
          <button class="admin-btn ghost" :disabled="saving" @click="save">Guardar</button>
          <button class="admin-btn" :disabled="saving" @click="publish">Publicar</button>
        </div>
      </div>

      <div class="admin-card">
        <AdminObjectEditor :model="editing.model" :lang="lang" :page-id="collection" :block-id="editing.id" />
      </div>
    </div>
  </div>
</template>
