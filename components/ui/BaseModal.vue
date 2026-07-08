<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  wide: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])
function close() { emit('update:modelValue', false) }
function onKey(e) { if (e.key === 'Escape') close() }
watch(() => props.modelValue, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})
onBeforeUnmount(() => { if (import.meta.client) document.body.style.overflow = '' })
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="close" @keydown="onKey" tabindex="-1">
      <div class="modal-panel" :class="{ wide }" role="dialog" aria-modal="true" :aria-label="title">
        <header v-if="title" class="modal-head">
          <h2>{{ title }}</h2>
          <button class="modal-x" aria-label="Cerrar" @click="close">×</button>
        </header>
        <div class="modal-body"><slot /></div>
        <footer v-if="$slots.footer" class="modal-foot"><slot name="footer" /></footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay { position: fixed; inset: 0; z-index: 900; background: rgba(15,24,54,.5); display: flex; align-items: flex-start; justify-content: center; padding: 5vh 16px; overflow: auto; }
.modal-panel { background: #fff; border-radius: 14px; width: 100%; max-width: 560px; box-shadow: 0 24px 60px rgba(21,32,59,.24); }
.modal-panel.wide { max-width: 880px; }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; border-bottom: 1px solid #e4eaf2; }
.modal-head h2 { margin: 0; font-size: 1.15rem; }
.modal-x { background: none; border: 0; font-size: 1.5rem; line-height: 1; cursor: pointer; color: #7a8190; }
.modal-body { padding: 20px; }
.modal-foot { padding: 16px 20px; border-top: 1px solid #e4eaf2; display: flex; gap: 12px; justify-content: flex-end; }
</style>
