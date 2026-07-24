<script setup>
import '~/assets/css/admin.css'
definePageMeta({ layout: false, pageTransition: false })
defineI18nRoute(false)

const { login, init, isAuthed, isEditor, ready } = useAuth()
const toast = useToast()
const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

onMounted(async () => {
  try {
    if (!ready.value) await init()
    if (isAuthed.value && isEditor.value) router.replace('/admin')
  } catch (e) {
    // Firebase aún no configurado (.env con placeholders): mostrar el login igual.
    console.warn('[auth] Firebase no configurado:', e?.code || e?.message)
  }
})

async function submit() {
  loading.value = true
  try {
    await login(email.value, password.value)
    router.replace('/admin')
  } catch (e) {
    toast.error('No se pudo iniciar sesión. Verificá email y contraseña.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="admin-login">
    <form class="box" @submit.prevent="submit">
      <h1>Grupo Higienissa</h1>
      <p class="sub">Panel de administración</p>
      <div class="admin-field">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" autocomplete="username" required>
      </div>
      <div class="admin-field">
        <label for="pass">Contraseña</label>
        <input id="pass" v-model="password" type="password" autocomplete="current-password" required>
      </div>
      <button class="admin-btn" style="width:100%;justify-content:center" :disabled="loading">
        {{ loading ? 'Ingresando…' : 'Ingresar' }}
      </button>
    </form>
    <ToastHost />
  </div>
</template>
