<script setup>
// "Panel de medición": objeto enmarcado tipo tablero que encarna "lo que pasa a ser medible".
// Filas indicador con estado cualitativo (NUNCA números que no vengan en el contenido).
const props = defineProps({
  kicker: { type: [Object, String], default: '' },
  title: { type: [Object, String], default: '' },
  source: { type: String, default: '' }, // rótulo tipo "Trazatex · data"
  items: { type: Array, required: true }, // { icon, label{es,en}, state{es,en} }
})
const t = useT()
</script>

<template>
  <div class="measure-board reveal">
    <div class="mb-bar">
      <span class="kicker" style="margin:0">{{ t(kicker) }}</span>
      <span v-if="source" class="mb-source"><span class="mb-dot" aria-hidden="true" />{{ source }}</span>
    </div>
    <ul class="mb-rows">
      <li v-for="(it, i) in items" :key="i" class="mb-row">
        <span class="mb-icon"><BaseIcon :name="it.icon" :size="22" /></span>
        <span class="mb-label">{{ t(it.label) }}</span>
        <span class="mb-state">{{ t(it.state) }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.measure-board { max-width: 880px; margin: 0 auto; background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); overflow: hidden; }
.mb-bar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); padding: var(--space-4) var(--space-5); background: var(--bg-alt); border-bottom: 1px solid var(--line); }
.mb-source { display: inline-flex; align-items: center; gap: 8px; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.mb-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--celeste); }
.mb-rows { list-style: none; margin: 0; padding: 0; }
.mb-row { display: grid; grid-template-columns: 46px 1fr auto; align-items: center; gap: var(--space-4); padding: var(--space-4) var(--space-5); border-top: 1px solid var(--line-soft); }
.mb-row:first-child { border-top: 0; }
.mb-icon { width: 46px; height: 46px; border-radius: 13px; display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(150deg, rgba(58,120,255,.12), rgba(78,167,225,.10)); color: var(--azul); }
.mb-label { font: 600 1.02rem var(--font-body); color: var(--ink); }
.mb-state { font: 600 var(--fs-small) var(--font-body); color: var(--azul); background: rgba(58,120,255,.08); border: 1px solid rgba(58,120,255,.18); border-radius: 999px; padding: 5px 12px; white-space: nowrap; }
@media (max-width: 620px) {
  .mb-row { grid-template-columns: 40px 1fr; }
  .mb-icon { width: 40px; height: 40px; }
  .mb-state { grid-column: 2; justify-self: start; }
}
</style>
