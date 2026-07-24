<script setup>
// Campo de imagen: preview + input de ruta/URL editable + botón de subida a Storage.
// v-model = string (url o ruta). La imagen nunca se guarda en Firestore, solo su URL/ruta.
defineOptions({ name: 'AdminImageUploader' })
const props = defineProps({
  modelValue: { type: String, default: '' },
  pageId: { type: String, default: 'misc' },
  blockId: { type: String, default: 'block' },
})
const emit = defineEmits(['update:modelValue'])

const { upload } = useStorage()
const toast = useToast()
const busy = ref(false)
const fileInput = ref(null)

async function onFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { toast.error('Solo imágenes.'); e.target.value = ''; return }
  if (file.size > 8 * 1024 * 1024) { toast.error('Máximo 8 MB.'); e.target.value = ''; return }
  busy.value = true
  try {
    const { url } = await upload(file, { pageId: props.pageId, blockId: props.blockId })
    emit('update:modelValue', url)
    toast.success('Imagen subida.')
  } catch {
    toast.error('No se pudo subir. Verificá Storage y permisos.')
  } finally {
    busy.value = false
    e.target.value = ''
  }
}
</script>

<template>
  <div class="img-uploader">
    <img v-if="modelValue" :src="modelValue" alt="" class="img-preview">
    <div class="img-actions">
      <input
        :value="modelValue"
        type="text"
        placeholder="URL o ruta de imagen"
        @input="emit('update:modelValue', $event.target.value)"
      >
      <button type="button" class="admin-btn ghost small img-upload-btn" :disabled="busy" @click="fileInput?.click()">
        {{ busy ? 'Subiendo…' : 'Subir' }}
      </button>
      <input ref="fileInput" type="file" accept="image/*" hidden @change="onFile">
    </div>
  </div>
</template>

<style scoped>
.img-uploader { display: flex; gap: 12px; align-items: flex-start; }
.img-preview { max-height: 70px; border-radius: 8px; border: 1px solid #e4eaf2; flex: none; }
.img-actions { display: flex; gap: 8px; align-items: center; flex: 1; min-width: 0; }
.img-actions input[type=text] { flex: 1; min-width: 0; }
.img-upload-btn { cursor: pointer; white-space: nowrap; }
.img-upload-btn.busy { opacity: .6; pointer-events: none; }
</style>
