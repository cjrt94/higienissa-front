<script setup>
definePageMeta({ layout: 'admin', pageTransition: false })
defineI18nRoute(false)
useHead({ title: 'Contactos · Admin' })

const toast = useToast()
const { confirm } = useConfirm()

const rows = ref([])
const loading = ref(true)
const err = ref('')
const open = ref(null) // solicitud abierta en detalle
const busy = ref(false)

const STATUSES = ['new', 'read', 'replied']

onMounted(async () => {
  try {
    const { db } = await useFirebase()
    const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
    const snap = await getDocs(query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc')))
    rows.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch {
    err.value = 'No se pudieron cargar los contactos. Verificá Firebase y el índice contactSubmissions(status, createdAt).'
  } finally {
    loading.value = false
  }
})

function fmtDate(ts) {
  const d = ts?.toDate?.() || (ts?._seconds ? new Date(ts._seconds * 1000) : null)
  return d ? d.toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }) : ''
}

async function setStatus(row, status) {
  if (row.status === status) return
  busy.value = true
  try {
    const { db } = await useFirebase()
    const { doc: dref, updateDoc } = await import('firebase/firestore')
    await updateDoc(dref(db, 'contactSubmissions', row.id), { status })
    row.status = status // in-place, sin refetch
    toast.success(`Marcado como "${status}".`)
  } catch {
    toast.error('No se pudo actualizar el estado.')
  } finally {
    busy.value = false
  }
}

async function remove(row) {
  const ok = await confirm({ title: 'Eliminar contacto', message: `¿Eliminar la solicitud de ${row.name} ${row.lastName}? No se puede deshacer.`, confirmText: 'Eliminar', danger: true })
  if (!ok) return
  busy.value = true
  try {
    const { db } = await useFirebase()
    const { doc: dref, deleteDoc } = await import('firebase/firestore')
    await deleteDoc(dref(db, 'contactSubmissions', row.id))
    rows.value = rows.value.filter((r) => r.id !== row.id)
    if (open.value?.id === row.id) open.value = null
    toast.success('Contacto eliminado.')
  } catch {
    toast.error('No se pudo eliminar.')
  } finally {
    busy.value = false
  }
}

function openRow(row) {
  open.value = row
  if (row.status === 'new') setStatus(row, 'read')
}
</script>

<template>
  <h1>Contactos</h1>
  <p v-if="loading" style="color:#7a8190">Cargando…</p>
  <div v-else-if="err" class="admin-card">{{ err }}</div>
  <div v-else-if="!rows.length" class="admin-card">Todavía no hay solicitudes de contacto.</div>
  <div v-else class="admin-list">
    <div v-for="r in rows" :key="r.id" class="admin-row">
      <div class="meta" style="cursor:pointer" @click="openRow(r)">
        <b>{{ r.name }} {{ r.lastName }} · {{ r.company }}</b>
        <small>{{ r.email }} · {{ r.sector }} · {{ r.ctaContext }} · {{ fmtDate(r.createdAt) }}</small>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <span class="badge-status" :class="r.status === 'new' ? 'draft' : 'published'">{{ r.status }}</span>
        <button class="admin-btn ghost small" @click="openRow(r)">Ver</button>
        <button class="admin-btn ghost small danger" :disabled="busy" @click="remove(r)">Eliminar</button>
      </div>
    </div>
  </div>

  <BaseModal :model-value="!!open" wide :title="open ? `${open.name} ${open.lastName}` : ''" @update:model-value="open = null">
    <div v-if="open" class="sub-detail">
      <p><b>Empresa:</b> {{ open.company }}<span v-if="open.position"> · {{ open.position }}</span></p>
      <p><b>Email:</b> <a :href="`mailto:${open.email}`">{{ open.email }}</a></p>
      <p><b>Sector:</b> {{ open.sector }} · <b>Interés:</b> {{ open.ctaContext }} · <b>Idioma:</b> {{ open.locale }}</p>
      <p><b>Recibido:</b> {{ fmtDate(open.createdAt) }}</p>
      <p class="sub-message">{{ open.message }}</p>
    </div>
    <template #footer>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <span style="color:#7a8190;font-size:.85rem">Estado:</span>
        <button v-for="s in STATUSES" :key="s" class="admin-btn ghost small" :class="{ active: open?.status === s }" :disabled="busy" @click="setStatus(open, s)">{{ s }}</button>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.sub-detail p { margin: 0 0 8px; }
.sub-message { white-space: pre-wrap; margin-top: 14px; padding: 14px; background: #f4f7fa; border-radius: 10px; }
.admin-btn.active { background: #1c2a87; color: #fff; }
</style>
