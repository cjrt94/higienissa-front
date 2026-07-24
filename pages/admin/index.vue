<script setup>
definePageMeta({ layout: 'admin', pageTransition: false })
defineI18nRoute(false)
useHead({ title: 'Panel · Higienissa Admin' })

const { profile } = useAuth()
const loading = ref(true)
const stats = ref({ pages: 0, brands: 0, sectors: 0, posts: 0, contacts: 0, contactsNew: 0 })
const recent = ref([])

const cards = computed(() => [
  { key: 'pages', to: '/admin/pages', label: 'Páginas', icon: 'M6 2h8l4 4v16H6zM14 2v4h4', n: stats.value.pages },
  { key: 'brands', to: '/admin/brands', label: 'Marcas', icon: 'M3 3h8l10 10-8 8L3 11zM7 7h.01', n: stats.value.brands },
  { key: 'sectors', to: '/admin/sectors', label: 'Sectores', icon: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5', n: stats.value.sectors },
  { key: 'posts', to: '/admin/posts', label: 'Artículos', icon: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z', n: stats.value.posts },
  { key: 'contacts', to: '/admin/submissions', label: 'Contactos', icon: 'M3 5h18v14H3zM3 6l9 7 9-7', n: stats.value.contacts, pill: stats.value.contactsNew },
])

const quick = [
  { to: '/admin/pages/home', label: 'Editar la Home', desc: 'Hero, secciones y SEO', icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { to: '/admin/posts', label: 'Nuevo artículo', desc: 'Publicar en el blog', icon: 'M12 5v14M5 12h14' },
  { to: '/admin/settings', label: 'Ajustes del sitio', desc: 'Contacto, redes, legales', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
  { to: '/admin/submissions', label: 'Ver contactos', desc: 'Solicitudes del formulario', icon: 'M3 5h18v14H3zM3 6l9 7 9-7' },
]

function fmtDate(ts) {
  const d = ts?.toDate?.() || (ts?._seconds ? new Date(ts._seconds * 1000) : null)
  return d ? d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) : ''
}

onMounted(async () => {
  try {
    const { db } = await useFirebase()
    const { collection, getCountFromServer, getDocs, query, orderBy, where, limit } = await import('firebase/firestore')
    const countOf = async (c, ...cons) => (await getCountFromServer(cons.length ? query(collection(db, c), ...cons) : collection(db, c))).data().count
    const [pages, brands, sectors, posts, contacts, contactsNew, recentSnap] = await Promise.all([
      countOf('pages'), countOf('brands'), countOf('sectors'), countOf('posts'),
      countOf('contactSubmissions'),
      countOf('contactSubmissions', where('status', '==', 'new')),
      getDocs(query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc'), limit(5))),
    ])
    stats.value = { pages, brands, sectors, posts, contacts, contactsNew }
    recent.value = recentSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (e) {
    console.warn('[panel] no se pudieron cargar métricas:', e?.code || e?.message)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div class="admin-page-head">
      <div>
        <h1>Hola, {{ profile?.name || 'equipo' }} 👋</h1>
        <p class="sub">Panel de administración del sitio de Grupo Higienissa.</p>
      </div>
    </div>

    <!-- Métricas -->
    <div class="admin-stats">
      <NuxtLink v-for="c in cards" :key="c.key" :to="c.to" class="stat-card">
        <div class="stat-top">
          <span class="stat-ico"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path :d="c.icon" /></svg></span>
          <span v-if="c.pill" class="stat-pill">{{ c.pill }} nuevo{{ c.pill > 1 ? 's' : '' }}</span>
        </div>
        <div class="stat-num">{{ loading ? '—' : c.n }}</div>
        <div class="stat-label">{{ c.label }}</div>
      </NuxtLink>
    </div>

    <div class="dash-grid">
      <!-- Contactos recientes -->
      <div>
        <div class="dash-section-title">Contactos recientes <NuxtLink to="/admin/submissions">Ver todos →</NuxtLink></div>
        <div class="admin-list">
          <div v-if="loading" class="admin-card" style="color:var(--a-faint)">Cargando…</div>
          <div v-else-if="!recent.length" class="admin-card" style="color:var(--a-faint)">Todavía no hay solicitudes de contacto.</div>
          <NuxtLink v-for="r in recent" :key="r.id" to="/admin/submissions" class="admin-row" style="text-decoration:none;color:inherit">
            <div class="meta">
              <b>{{ r.name }} {{ r.lastName }} · {{ r.company }}</b>
              <small>{{ r.email }} · {{ r.sector }}</small>
            </div>
            <div style="display:flex;gap:10px;align-items:center">
              <span class="badge-status" :class="r.status === 'new' ? 'draft' : 'published'">{{ r.status }}</span>
              <small style="color:var(--a-faint)">{{ fmtDate(r.createdAt) }}</small>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Accesos rápidos -->
      <div>
        <div class="dash-section-title">Accesos rápidos</div>
        <div class="quick-grid">
          <NuxtLink v-for="q in quick" :key="q.to" :to="q.to" class="quick-link">
            <span class="q-ico"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path :d="q.icon" /></svg></span>
            <span><b>{{ q.label }}</b><small>{{ q.desc }}</small></span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
