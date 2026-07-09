<script setup>
// Comparativa de dos estados "de → a". La columna "antes" es recesiva (oscura, apagada);
// la columna "ahora" domina (branded, elevada). La columna "antes" es UN enunciado conceptual
// del copy aprobado; la columna "ahora" lista los cambios reales. No inventa datos por-ítem.
const props = defineProps({
  from: { type: Object, required: true }, // { label{es,en}, statement{es,en} }
  to: { type: Object, required: true }, // { label{es,en}, items:[{es,en}] }
})
const t = useT()
</script>

<template>
  <div class="fromto reveal">
    <div class="ft-before">
      <span class="ft-tag">{{ t(from.label) }}</span>
      <p class="ft-statement">{{ t(from.statement) }}</p>
    </div>

    <div class="ft-arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </div>

    <div class="ft-after">
      <span class="ft-tag-strong">{{ t(to.label) }}</span>
      <ul class="ft-list">
        <li v-for="(it, i) in to.items" :key="i">
          <span class="ft-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </span>
          <span>{{ t(it) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.fromto { display: grid; grid-template-columns: .95fr auto 1.5fr; align-items: stretch; gap: clamp(var(--space-4), 3vw, var(--space-7)); }

/* ANTES — recesivo, claro y apagado (mismo alto que "ahora", sin elevación) */
.ft-before { display: flex; flex-direction: column; justify-content: center; background: var(--bg-alt); color: var(--muted); border: 1px solid var(--line); border-radius: var(--radius); padding: clamp(var(--space-6), 3vw, var(--space-7)); min-height: 220px; }
.ft-before .ft-tag { display: inline-block; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: var(--space-3); }
.ft-statement { margin: 0; font-size: 1.05rem; line-height: 1.55; }

/* Flecha de transición */
.ft-arrow { color: var(--electrico); align-self: center; }
.ft-arrow svg { width: 40px; height: 40px; display: block; }

/* AHORA — dominante, branded, elevado */
.ft-after { position: relative; background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: clamp(var(--space-6), 3vw, var(--space-7)); box-shadow: var(--shadow-lg); }
.ft-tag-strong { display: inline-block; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: var(--electrico); margin-bottom: var(--space-4); }
.ft-list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-4); }
.ft-list li { display: flex; gap: var(--space-3); align-items: center; color: var(--ink); font: 600 1.1rem var(--font-body); }
.ft-check { flex: none; width: 28px; height: 28px; border-radius: 50%; background: var(--electrico); color: #fff; display: inline-flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); }
.ft-check svg { width: 15px; height: 15px; }

@media (max-width: 860px) {
  .fromto { grid-template-columns: 1fr; }
  .ft-arrow { transform: rotate(90deg); justify-self: center; }
}
</style>
