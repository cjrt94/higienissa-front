<script setup>
// Franja compacta de alianza tecnológica ASIS IDTRAK (logo + copy + link).
// Reutilizable; recibe el copy/enlace por props ({es,en}). El logo vive en /img/asis-logo.png.
defineProps({
  body: { type: [Object, String], default: '' },
  linkLabel: { type: [Object, String], default: '' },
  to: { type: String, default: '' },
})
const t = useT()
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="asis-partner">
        <img class="asis-partner-logo" src="/img/asis-logo.png" alt="ASIS IDTRAK" width="308" height="202">
        <p v-if="body" class="asis-partner-copy">{{ t(body) }}</p>
        <a v-if="to" class="link-arrow asis-partner-link" :href="to">{{ t(linkLabel) }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.asis-partner { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: clamp(var(--space-5), 4vw, var(--space-7)); padding: clamp(var(--space-5), 3vw, var(--space-6)) clamp(var(--space-6), 4vw, var(--space-8)); background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius-lg); box-shadow: var(--shadow-xs); }
.asis-partner-logo { width: auto; height: 56px; flex: none; }
.asis-partner-copy { margin: 0; color: var(--text); font-size: var(--fs-body-sm); line-height: 1.55; max-width: 62ch; }
.asis-partner-link { flex: none; white-space: nowrap; }
@media (max-width: 780px) {
  .asis-partner { grid-template-columns: 1fr; justify-items: start; gap: var(--space-4); text-align: left; }
  .asis-partner-logo { height: 48px; }
}
</style>
