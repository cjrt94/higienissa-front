<script setup>
definePageMeta({ layout: 'admin' })
defineI18nRoute(false)
useHead({ title: 'Ajustes · Admin' })

const toast = useToast()
const { confirm } = useConfirm()
const { rebuild } = usePublish()

const doc = ref(null)
const loading = ref(true)
const saving = ref(false)
const lang = ref('es')

onMounted(async () => {
  try {
    const { db } = await useFirebase()
    const { doc: dref, getDoc } = await import('firebase/firestore')
    const snap = await getDoc(dref(db, 'settings', 'global'))
    doc.value = snap.exists()
      ? snap.data()
      : { contact: { email: '', phone: '', city: { es: '', en: '' } }, social: { linkedin: '', instagram: '', youtube: '' } }
  } catch {
    toast.error('No se pudo cargar. Verificá Firebase en .env.')
  } finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  try {
    const { db } = await useFirebase()
    const { doc: dref, setDoc, serverTimestamp } = await import('firebase/firestore')
    await setDoc(dref(db, 'settings', 'global'), { ...doc.value, updatedAt: serverTimestamp() }, { merge: true })
    toast.success('Ajustes guardados.')
  } catch {
    toast.error('No se pudieron guardar los ajustes.')
  } finally {
    saving.value = false
  }
}

async function onPublish() {
  const ok = await confirm({ title: 'Publicar ajustes', message: 'Se guardarán los ajustes y se disparará el rebuild del sitio. ¿Continuar?', confirmText: 'Publicar' })
  if (!ok) return
  saving.value = true
  try {
    await save()
    await rebuild()
    toast.success('Publicado. El sitio se está reconstruyendo.')
  } catch {
    toast.error('No se pudo publicar (revisá la Cloud Function rebuild).')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <h1>Ajustes del sitio</h1>

  <p v-if="loading" style="color:#7a8190">Cargando…</p>
  <div v-else-if="doc">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap">
      <div class="lang-tabs">
        <button :class="{ active: lang === 'es' }" @click="lang = 'es'">ES</button>
        <button :class="{ active: lang === 'en' }" @click="lang = 'en'">EN</button>
      </div>
      <div style="display:flex;gap:10px">
        <button class="admin-btn ghost" :disabled="saving" @click="save">Guardar</button>
        <button class="admin-btn" :disabled="saving" @click="onPublish">Publicar</button>
      </div>
    </div>

    <div class="admin-card">
      <AdminObjectEditor :model="doc" :lang="lang" page-id="settings" block-id="global" />
    </div>
  </div>
</template>
