<script setup>
import draggable from 'vuedraggable'
definePageMeta({ layout: 'admin', pageTransition: false })
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
const selected = ref(null) // 'seo' | bloque | null

useHead(() => ({ title: `Editar ${id} · Admin` }))

const BLOCK_LABELS = {
  hero: 'Hero', groupIntro: 'Quiénes somos', divisions: 'Divisiones', pillars: 'Pilares',
  sectorsBlock: 'Sectores', asis: 'ASIS', finalCta: 'CTA final', richText: 'Texto',
  whoWeAre: 'Quiénes somos', ecosystem: 'Ecosistema', capabilities: 'Capacidades',
  methodology: 'Metodología', differentiators: 'Diferenciadores', aside: 'Panel lateral',
  process: 'Proceso', body: 'Cuerpo', related: 'Relacionados', filters: 'Filtros',
  posts: 'Posts', pagination: 'Paginación',
}
const blockLabel = (t) => BLOCK_LABELS[t] || t

onMounted(async () => {
  try {
    const { db } = await useFirebase()
    const { doc: dref, getDoc } = await import('firebase/firestore')
    const snap = await getDoc(dref(db, 'pages', id))
    if (!snap.exists()) { toast.error('Página no encontrada.'); router.replace('/admin/pages'); return }
    const data = snap.data()
    doc.value = {
      ...data,
      seo: data.seo || { title: { es: '', en: '' }, description: { es: '', en: '' } },
      blocks: structuredClone(data.draft?.blocks || data.blocks || []),
    }
    selected.value = doc.value.blocks[0] || 'seo'
  } catch (e) {
    toast.error('No se pudo cargar. Verificá Firebase en .env.')
  } finally {
    loading.value = false
  }
})

function addTextBlock() {
  const block = {
    id: `richText-${crypto.randomUUID().slice(0, 8)}`,
    type: 'richText',
    order: doc.value.blocks.length,
    data: { title: { es: '', en: '' }, body: { es: '', en: '' } },
  }
  doc.value.blocks.push(block)
  selected.value = block
}

async function removeBlock(el) {
  const ok = await confirm({ title: 'Eliminar bloque', message: `¿Eliminar el bloque "${blockLabel(el.type)}"? Se aplica al guardar.`, confirmText: 'Eliminar', danger: true })
  if (!ok) return
  const i = doc.value.blocks.indexOf(el)
  if (i >= 0) doc.value.blocks.splice(i, 1)
  if (selected.value === el) selected.value = doc.value.blocks[0] || 'seo'
}

async function saveDraft() {
  saving.value = true
  try {
    const { db } = await useFirebase()
    const { doc: dref, setDoc, serverTimestamp } = await import('firebase/firestore')
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
  <div>
    <div class="editor-bar">
      <div style="display:flex;align-items:center;gap:12px;min-width:0">
        <NuxtLink to="/admin/pages" class="admin-btn ghost small">←</NuxtLink>
        <div style="min-width:0">
          <h1 style="margin:0;font-size:1.25rem;text-transform:capitalize">{{ id }}</h1>
          <span v-if="doc" class="badge-status" :class="doc.status === 'published' ? 'published' : 'draft'">{{ doc.status === 'published' ? 'publicada' : 'borrador' }}</span>
        </div>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <div class="lang-tabs">
          <button :class="{ active: lang === 'es' }" @click="lang = 'es'">ES</button>
          <button :class="{ active: lang === 'en' }" @click="lang = 'en'">EN</button>
        </div>
        <button class="admin-btn ghost" :disabled="saving || !doc" @click="saveDraft">Guardar borrador</button>
        <button class="admin-btn" :disabled="saving || !doc" @click="onPublish">Publicar</button>
      </div>
    </div>

    <div v-if="loading" style="display:grid;place-items:center;padding:60px"><div class="admin-spinner" /></div>

    <div v-else-if="doc" class="editor-2col">
      <!-- Columna izquierda: SEO + lista de bloques -->
      <div>
        <div class="block-list">
          <div class="block-item" :class="{ 'is-active': selected === 'seo' }" @click="selected = 'seo'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            <span class="b-name">SEO</span>
          </div>
          <draggable v-model="doc.blocks" item-key="id" handle=".drag" class="block-list">
            <template #item="{ element }">
              <div class="block-item" :class="{ 'is-active': selected === element }" @click="selected = element">
                <span class="drag" title="Arrastrar para reordenar">⠿</span>
                <span class="b-name">{{ blockLabel(element.type) }}</span>
                <button class="b-del" title="Eliminar" @click.stop="removeBlock(element)">×</button>
              </div>
            </template>
          </draggable>
        </div>
        <button class="admin-btn ghost small" style="margin-top:12px;width:100%;justify-content:center" @click="addTextBlock">+ Bloque de texto</button>
      </div>

      <!-- Columna derecha: editor del bloque seleccionado -->
      <div class="editor-pane">
        <template v-if="selected === 'seo'">
          <div class="editor-pane-head"><b>SEO ({{ lang.toUpperCase() }})</b></div>
          <div class="editor-pane-body">
            <div class="admin-field">
              <label>Título</label>
              <input v-model="doc.seo.title[lang]" type="text" maxlength="70">
              <span class="hint">Máx. 70 caracteres · aparece en la pestaña del navegador y en Google.</span>
            </div>
            <div class="admin-field">
              <label>Descripción</label>
              <textarea v-model="doc.seo.description[lang]" maxlength="180" />
              <span class="hint">Máx. 180 caracteres · el resumen que muestra Google.</span>
            </div>
          </div>
        </template>

        <template v-else-if="selected">
          <div class="editor-pane-head">
            <b>{{ blockLabel(selected.type) }}</b>
            <span class="hint" style="font-size:.78rem">{{ lang.toUpperCase() }}</span>
          </div>
          <div class="editor-pane-body">
            <AdminObjectEditor :model="selected.data" :lang="lang" :page-id="id" :block-id="selected.type" />
          </div>
        </template>

        <div v-else class="editor-empty">
          <div class="big">✎</div>
          Seleccioná un bloque de la izquierda para editar su contenido.
        </div>
      </div>
    </div>
  </div>
</template>
