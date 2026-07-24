<script setup>
import '~/assets/css/admin.css'

const { ready, init, isAuthed, isEditor, profile, logout } = useAuth()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  try {
    if (!ready.value) await init()
  } catch (e) {
    console.warn('[auth] Firebase no configurado:', e?.code || e?.message)
  }
  if (!isAuthed.value || !isEditor.value) router.replace('/admin/login')
})

async function onLogout() {
  await logout()
  router.replace('/admin/login')
}

// Grupos de navegación
const groups = [
  {
    label: 'Contenido',
    items: [
      { to: '/admin', label: 'Panel', icon: 'grid' },
      { to: '/admin/pages', label: 'Páginas', icon: 'file' },
      { to: '/admin/brands', label: 'Marcas', icon: 'tag' },
      { to: '/admin/sectors', label: 'Sectores', icon: 'layers' },
      { to: '/admin/posts', label: 'Blog', icon: 'edit' },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { to: '/admin/submissions', label: 'Contactos', icon: 'mail' },
      { to: '/admin/settings', label: 'Ajustes', icon: 'cog' },
    ],
  },
]

const ICONS = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  file: 'M6 2h8l4 4v16H6zM14 2v4h4',
  tag: 'M3 3h8l10 10-8 8L3 11zM7 7h.01',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  cog: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H7a1.6 1.6 0 0 0 1-1.5V1a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H23a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z',
}

function navActive(to) {
  return to === '/admin' ? route.path === '/admin' : route.path.startsWith(to)
}
const initials = computed(() => {
  const n = `${profile.value?.name || ''} ${profile.value?.lastName || ''}`.trim()
  return n ? n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() : 'A'
})
</script>

<template>
  <div>
    <div v-if="ready && isAuthed && isEditor" class="admin-shell">
      <aside class="admin-side">
        <div class="brand"><span class="brand-dot">H</span> Higienissa</div>
        <template v-for="g in groups" :key="g.label">
          <div class="nav-label">{{ g.label }}</div>
          <NuxtLink v-for="n in g.items" :key="n.to" :to="n.to" :class="{ 'is-active': navActive(n.to) }">
            <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path :d="ICONS[n.icon]" /></svg>
            {{ n.label }}
          </NuxtLink>
        </template>
        <div class="spacer" />
        <div class="side-foot">
          <div class="side-user">
            <span class="avatar">{{ initials }}</span>
            <span><b>{{ profile?.name }} {{ profile?.lastName }}</b><small>{{ profile?.role }}</small></span>
          </div>
          <a href="#" @click.prevent="onLogout">
            <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            Cerrar sesión
          </a>
        </div>
      </aside>
      <main class="admin-main">
        <slot />
      </main>
    </div>

    <div v-else class="admin-loading">
      <div class="admin-spinner" />
    </div>

    <ToastHost />
    <ConfirmDialog />
  </div>
</template>
