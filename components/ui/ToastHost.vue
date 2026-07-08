<script setup>
const { toasts, remove } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-host" aria-live="polite" aria-atomic="false">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="`toast--${t.type}`" role="status">
        <span>{{ t.message }}</span>
        <button class="toast-x" aria-label="Cerrar" @click="remove(t.id)">×</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-host { position: fixed; right: 16px; bottom: 16px; z-index: 1000; display: flex; flex-direction: column; gap: 8px; max-width: min(92vw, 380px); }
.toast { display: flex; gap: 12px; align-items: flex-start; justify-content: space-between; background: #15203b; color: #fff; border-radius: 10px; padding: 12px 14px; box-shadow: 0 12px 28px rgba(21,32,59,.24); font-size: .92rem; }
.toast--success { background: #12603f; }
.toast--error { background: #8a2033; }
.toast-x { background: none; border: 0; color: inherit; font-size: 1.2rem; line-height: 1; cursor: pointer; opacity: .8; }
.toast-x:hover { opacity: 1; }
</style>
