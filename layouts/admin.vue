<script setup>
import '~/assets/css/admin.css'

const { ready, init, isAuthed, isEditor, profile, logout } = useAuth()
const router = useRouter()

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

const nav = [
  { to: '/admin', label: 'Panel' },
  { to: '/admin/pages', label: 'Páginas' },
  { to: '/admin/brands', label: 'Marcas' },
  { to: '/admin/sectors', label: 'Sectores' },
  { to: '/admin/posts', label: 'Blog' },
  { to: '/admin/submissions', label: 'Contactos' },
]
</script>

<template>
  <div>
    <div v-if="ready && isAuthed && isEditor" class="admin-shell">
      <aside class="admin-side">
        <div class="brand">Higienissa · Admin</div>
        <NuxtLink v-for="n in nav" :key="n.to" :to="n.to">{{ n.label }}</NuxtLink>
        <div class="spacer" />
        <a href="#" @click.prevent="onLogout">Cerrar sesión</a>
      </aside>
      <main class="admin-main">
        <div class="admin-topbar">
          <div class="admin-user">
            <span>{{ profile?.name }} {{ profile?.lastName }} · {{ profile?.role }}</span>
          </div>
        </div>
        <slot />
      </main>
    </div>
    <div v-else class="admin-login"><div class="box"><p class="sub">Cargando…</p></div></div>

    <ToastHost />
    <ConfirmDialog />
  </div>
</template>
