<script setup>
definePageMeta({ layout: 'admin', pageTransition: false })
defineI18nRoute(false)
useHead({ title: 'Páginas · Admin' })

const rows = ref([])
const loading = ref(true)
const err = ref('')

onMounted(async () => {
  try {
    const { db } = await useFirebase()
    const { collection, getDocs } = await import('firebase/firestore')
    const snap = await getDocs(collection(db, 'pages'))
    rows.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (e) {
    err.value = 'No se pudieron cargar las páginas. Verificá la configuración de Firebase en .env.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <h1>Páginas</h1>

  <p v-if="loading" style="color:#7a8190">Cargando…</p>
  <div v-else-if="err" class="admin-card">{{ err }}</div>
  <div v-else-if="!rows.length" class="admin-card">
    Todavía no hay páginas en Firestore. El contenido semilla vive en <code>/content</code>;
    importalo a la colección <code>pages</code> (o creá los documentos) para editarlo desde acá.
  </div>
  <div v-else class="admin-list">
    <div v-for="p in rows" :key="p.id" class="admin-row">
      <div class="meta">
        <b>{{ p.slug || p.id }}</b>
        <small>{{ p.template }}</small>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <span class="badge-status" :class="p.status">{{ p.status }}</span>
        <NuxtLink class="admin-btn ghost small" :to="`/admin/pages/${p.id}`">Editar</NuxtLink>
      </div>
    </div>
  </div>
</template>
