<script setup>
definePageMeta({ layout: 'admin', pageTransition: false })
defineI18nRoute(false)
useHead({ title: 'Páginas · Admin' })

const rows = ref([])
const loading = ref(true)
const err = ref('')

// Orden de prioridad (Home primero); las páginas fuera de la lista van al final.
const ORDER = ['home', 'institucional', 'recursos', 'contacto', 'aviso-legal', 'privacidad']
const LABELS = {
  home: 'Home', institucional: 'Nosotros', recursos: 'Recursos', contacto: 'Contacto',
  articulo: 'Artículo (plantilla)', 'aviso-legal': 'Aviso legal', privacidad: 'Privacidad',
}
const rank = (id) => { const i = ORDER.indexOf(id); return i === -1 ? 999 : i }
const sorted = computed(() => [...rows.value].sort((a, b) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id)))
const label = (p) => LABELS[p.id] || p.slug || p.id

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
  <div>
    <div class="admin-page-head">
      <div>
        <h1>Páginas</h1>
        <p class="sub">Editá el contenido, las secciones y el SEO de cada página del sitio.</p>
      </div>
    </div>

    <div v-if="loading" style="display:grid;place-items:center;padding:50px"><div class="admin-spinner" /></div>
    <div v-else-if="err" class="admin-card">{{ err }}</div>
    <div v-else-if="!rows.length" class="admin-card">
      Todavía no hay páginas en Firestore. Corré <code>npm run seed</code> para importar el contenido semilla.
    </div>
    <div v-else class="admin-list">
      <NuxtLink v-for="p in sorted" :key="p.id" :to="`/admin/pages/${p.id}`" class="admin-row" style="text-decoration:none;color:inherit">
        <div class="meta">
          <b>{{ label(p) }}</b>
          <small>/{{ p.slug || p.id }} · {{ p.template }}</small>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <span class="badge-status" :class="p.status === 'published' ? 'published' : 'draft'">{{ p.status === 'published' ? 'publicada' : 'borrador' }}</span>
          <span class="admin-btn ghost small">Editar</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
