<script setup>
definePageMeta({ layout: 'admin' })
defineI18nRoute(false)
useHead({ title: 'Contactos · Admin' })

const rows = ref([])
const loading = ref(true)
const err = ref('')

onMounted(async () => {
  try {
    const { db } = await useFirebase()
    const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
    const snap = await getDocs(query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc')))
    rows.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (e) {
    err.value = 'No se pudieron cargar los contactos. Verificá Firebase y el índice contactSubmissions(status, createdAt).'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <h1>Contactos</h1>
  <p v-if="loading" style="color:#7a8190">Cargando…</p>
  <div v-else-if="err" class="admin-card">{{ err }}</div>
  <div v-else-if="!rows.length" class="admin-card">Todavía no hay solicitudes de contacto.</div>
  <div v-else class="admin-list">
    <div v-for="r in rows" :key="r.id" class="admin-row">
      <div class="meta">
        <b>{{ r.name }} {{ r.lastName }} · {{ r.company }}</b>
        <small>{{ r.email }} · {{ r.sector }} · {{ r.ctaContext }}</small>
      </div>
      <span class="badge-status" :class="r.status === 'new' ? 'draft' : 'published'">{{ r.status }}</span>
    </div>
  </div>
</template>
