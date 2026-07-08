<script setup>
// Editor recursivo de contenido. Reconoce:
//  · campo bilingüe { es, en } → dos inputs (según pestaña de idioma)
//  · string → un input (o textarea si es largo)
//  · array → lista de ítems (cada uno recursivo)
//  · objeto → recurre por claves
// Muta el objeto en sitio (reactividad Vue). No refetch tras editar.
defineOptions({ name: 'AdminObjectEditor' })
const props = defineProps({
  model: { type: [Object, Array], required: true },
  lang: { type: String, default: 'es' }, // pestaña de idioma activa
})

const isBilingual = (v) => v && typeof v === 'object' && !Array.isArray(v)
  && ('es' in v || 'en' in v) && Object.keys(v).every((k) => ['es', 'en'].includes(k))

const entries = computed(() =>
  Array.isArray(props.model)
    ? props.model.map((v, i) => ({ key: i, label: `#${i + 1}`, value: v }))
    : Object.entries(props.model).map(([k, v]) => ({ key: k, label: k, value: v })),
)

const label = (k) => String(k).replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
const isLong = (v) => typeof v === 'string' && v.length > 80
</script>

<template>
  <div class="obj-editor">
    <div v-for="e in entries" :key="e.key" class="obj-row">
      <!-- bilingüe -->
      <div v-if="isBilingual(e.value)" class="admin-field">
        <label>{{ label(e.label) }} <span style="color:#7a8190">· {{ lang.toUpperCase() }}</span></label>
        <textarea v-if="isLong(e.value[lang])" v-model="e.value[lang]" rows="3" />
        <input v-else v-model="e.value[lang]" type="text">
      </div>

      <!-- string simple (imágenes, refs, slugs) -->
      <div v-else-if="typeof e.value === 'string'" class="admin-field">
        <label>{{ label(e.label) }}</label>
        <input v-model="props.model[e.key]" type="text">
        <img v-if="/\.(jpg|jpeg|png|webp)$/i.test(e.value)" :src="e.value" alt="" style="max-height:70px;border-radius:8px;margin-top:6px">
      </div>

      <!-- número / bool -->
      <div v-else-if="typeof e.value === 'number' || typeof e.value === 'boolean'" class="admin-field">
        <label>{{ label(e.label) }}</label>
        <input v-model="props.model[e.key]" type="text">
      </div>

      <!-- array u objeto anidado -->
      <fieldset v-else-if="e.value && typeof e.value === 'object'" class="obj-nest">
        <legend>{{ label(e.label) }}</legend>
        <AdminObjectEditor :model="e.value" :lang="lang" />
      </fieldset>
    </div>
  </div>
</template>

<style scoped>
.obj-nest { border: 1px solid #e4eaf2; border-radius: 10px; padding: 12px 14px; margin: 0 0 14px; }
.obj-nest legend { font-weight: 700; font-size: .82rem; text-transform: capitalize; color: #1c2a87; padding: 0 6px; }
</style>
