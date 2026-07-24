<script setup>
import draggable from 'vuedraggable'
definePageMeta({ layout: 'admin' })
defineI18nRoute(false)

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { confirm } = useConfirm()
const { publish } = usePublish()

const id = route.params.id
const doc = ref(null)
const loading = ref(true)
const saving = ref(false)
const lang = ref('es')
const editing = ref(null) // bloque en edición (modal)

useHead(() => ({ title: `Editar ${id} · Admin` }))

onMounted(async () => {
  try {
    const { db } = await useFirebase()
    const { doc: dref, getDoc } = await import('firebase/firestore')
    const snap = await getDoc(dref(db, 'pages', id))
    if (!snap.exists()) { toast.error('Página no encontrada.'); router.replace('/admin/pages'); return }
    const data = snap.data()
    // trabajar sobre el draft (o clon de lo publicado)
    doc.value = {
      ...data,
      seo: data.seo || { title: { es: '', en: '' }, description: { es: '', en: '' } },
      blocks: structuredClone(data.draft?.blocks || data.blocks || []),
    }
  } catch (e) {
    toast.error('No se pudo cargar. Verificá Firebase en .env.')
  } finally {
    loading.value = false
  }
})

function addTextBlock() {
  doc.value.blocks.push({
    id: `richText-${crypto.randomUUID().slice(0, 8)}`,
    type: 'richText',
    order: doc.value.blocks.length,
    data: { title: { es: '', en: '' }, body: { es: '', en: '' } },
  })
}

async function removeBlock(el) {
  const ok = await confirm({ title: 'Eliminar bloque', message: `¿Eliminar el bloque "${el.type}"? Se aplica al guardar.`, confirmText: 'Eliminar', danger: true })
  if (!ok) return
  const i = doc.value.blocks.indexOf(el)
  if (i >= 0) doc.value.blocks.splice(i, 1)
  if (editing.value === el) editing.value = null
}

async function saveDraft() {
  saving.value = true
  try {
    const { db } = await useFirebase()
    const { doc: dref, setDoc, serverTimestamp } = await import('firebase/firestore')
    // Renumerar `order` por posición del array (el arrastre reordena el array, no el campo).
    const blocks = doc.value.blocks.map((b, i) => ({ ...b, order: i }))
    await setDoc(dref(db, 'pages', id), {
      seo: doc.value.seo,
      draft: { blocks },
      status: doc.value.status || 'draft',
      updatedAt: serverTimestamp(),
    }, { merge: true })
    toast.success('Borrador guardado.')
  } catch (e) {
    toast.error('No se pudo guardar el borrador.')
  } finally {
    saving.value = false
  }
}

async function onPublish() {
  const ok = await confirm({ title: 'Publicar página', message: 'Se publicará el borrador y se disparará el rebuild del sitio. ¿Continuar?', confirmText: 'Publicar' })
  if (!ok) return
  saving.value = true
  try {
    await saveDraft()
    await publish('pages', id)
    doc.value.status = 'published'
    toast.success('Publicado. El sitio se está reconstruyendo.')
  } catch (e) {
    toast.error('No se pudo publicar (revisá la Cloud Function publishPage).')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <h1>Editar: {{ id }}</h1>

  <p v-if="loading" style="color:#7a8190">Cargando…</p>
  <div v-else-if="doc">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap">
      <div class="lang-tabs">
        <button :class="{ active: lang === 'es' }" @click="lang = 'es'">ES</button>
        <button :class="{ active: lang === 'en' }" @click="lang = 'en'">EN</button>
      </div>
      <div style="display:flex;gap:10px">
        <button class="admin-btn ghost" :disabled="saving" @click="saveDraft">Guardar borrador</button>
        <button class="admin-btn" :disabled="saving" @click="onPublish">Publicar</button>
      </div>
    </div>

    <!-- SEO -->
    <div class="admin-card" style="margin-bottom:20px">
      <b style="display:block;margin-bottom:12px">SEO ({{ lang.toUpperCase() }})</b>
      <div class="admin-field">
        <label>Título</label>
        <input v-model="doc.seo.title[lang]" type="text" maxlength="70">
        <span class="hint">Máx. 70 caracteres.</span>
      </div>
      <div class="admin-field">
        <label>Descripción</label>
        <textarea v-model="doc.seo.description[lang]" maxlength="180" />
        <span class="hint">Máx. 180 caracteres.</span>
      </div>
    </div>

    <!-- Bloques -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <b>Bloques ({{ doc.blocks.length }})</b>
      <button class="admin-btn ghost small" @click="addTextBlock">+ Bloque de texto</button>
    </div>
    <draggable v-model="doc.blocks" item-key="id" handle=".drag" class="admin-list">
      <template #item="{ element }">
        <div class="admin-row">
          <div class="meta" style="flex-direction:row;align-items:center;gap:12px">
            <span class="drag" style="cursor:grab;color:#c9d3e8">⠿</span>
            <div class="meta">
              <b>{{ element.type }}</b>
              <small>orden {{ element.order }}</small>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="admin-btn ghost small" @click="editing = element">Editar contenido</button>
            <button class="admin-btn ghost small danger" @click="removeBlock(element)">Eliminar</button>
          </div>
        </div>
      </template>
    </draggable>

    <BaseModal :model-value="!!editing" wide :title="`Bloque: ${editing?.type}`" @update:model-value="editing = null">
      <div v-if="editing">
        <div class="lang-tabs">
          <button :class="{ active: lang === 'es' }" @click="lang = 'es'">ES</button>
          <button :class="{ active: lang === 'en' }" @click="lang = 'en'">EN</button>
        </div>
        <AdminObjectEditor :model="editing.data" :lang="lang" :page-id="id" :block-id="editing.type" />
      </div>
      <template #footer>
        <button class="admin-btn" @click="editing = null">Listo</button>
      </template>
    </BaseModal>
  </div>
</template>
