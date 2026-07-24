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
  pageId: { type: String, default: 'misc' }, // contexto para la ruta de Storage
  blockId: { type: String, default: 'block' },
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
// Campo de imagen: por extensión de archivo o por nombre de clave (excluye `icon`, que son
// nombres de íconos Lucide, y `imageAlt`, que es bilingüe y se maneja aparte).
const isImageField = (k, v) =>
  /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(v) ||
  (/(image|img|photo|cover|poster|logo)/i.test(String(k)) && !/alt/i.test(String(k)))
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

      <!-- string de imagen → subidor a Storage -->
      <div v-else-if="typeof e.value === 'string' && isImageField(e.label, e.value)" class="admin-field">
        <label>{{ label(e.label) }}</label>
        <ImageUploader v-model="props.model[e.key]" :page-id="pageId" :block-id="blockId" />
      </div>

      <!-- string simple (refs, slugs, íconos) -->
      <div v-else-if="typeof e.value === 'string'" class="admin-field">
        <label>{{ label(e.label) }}</label>
        <input v-model="props.model[e.key]" type="text">
      </div>

      <!-- booleano → checkbox -->
      <div v-else-if="typeof e.value === 'boolean'" class="admin-field admin-field-check">
        <label><input v-model="props.model[e.key]" type="checkbox"> {{ label(e.label) }}</label>
      </div>

      <!-- número -->
      <div v-else-if="typeof e.value === 'number'" class="admin-field">
        <label>{{ label(e.label) }}</label>
        <input v-model.number="props.model[e.key]" type="number">
      </div>

      <!-- array u objeto anidado -->
      <fieldset v-else-if="e.value && typeof e.value === 'object'" class="obj-nest">
        <legend>{{ label(e.label) }}</legend>
        <AdminObjectEditor :model="e.value" :lang="lang" :page-id="pageId" :block-id="blockId" />
      </fieldset>
    </div>
  </div>
</template>

<style scoped>
.obj-nest { border: 1px solid #e4eaf2; border-radius: 10px; padding: 12px 14px; margin: 0 0 14px; }
.obj-nest legend { font-weight: 700; font-size: .82rem; text-transform: capitalize; color: #1c2a87; padding: 0 6px; }
</style>
