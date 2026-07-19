<script setup>
// Riesgos operativos: ledger editorial con cabecera sticky. Soporta riesgos planos
// (items) o agrupados por dimensión (groups: [{ label, items }]). Marcador "!" teñido
// por sector; hairlines entre filas. Nunca borde-barra de acento en las filas.
const props = defineProps({
  kicker: { type: [Object, String], default: '' },
  title: { type: [Object, String], default: '' },
  lead: { type: [Object, String], default: '' },
  punch: { type: [Object, String], default: '' },
  items: { type: Array, default: () => [] },   // [{es,en}]
  groups: { type: Array, default: () => [] },  // [{ label, items:[{es,en}] }]
})
const t = useT()
const asGroups = computed(() =>
  props.groups && props.groups.length
    ? props.groups
    : [{ label: null, items: props.items }],
)
</script>

<template>
  <section class="section sector-risks">
    <div class="container risk-split">
      <header class="risk-head">
        <span class="risk-kicker">{{ t(kicker) }}</span>
        <h2 class="risk-title">{{ t(title) }}</h2>
        <p v-if="lead" class="risk-lead">{{ t(lead) }}</p>
        <p v-if="punch" class="risk-punch">{{ t(punch) }}</p>
      </header>

      <div class="risk-body reveal">
        <div v-for="(g, gi) in asGroups" :key="gi" class="risk-group">
          <span v-if="g.label" class="risk-group-label">{{ t(g.label) }}</span>
          <ul class="risk-rows">
            <li v-for="(it, i) in g.items" :key="i" class="risk-row">
              <span class="risk-mark" aria-hidden="true">!</span>
              <span class="risk-text">{{ t(it) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.risk-split { display: grid; grid-template-columns: 1fr 1.45fr; gap: clamp(var(--space-6), 5vw, var(--space-9)); align-items: start; }

.risk-head { position: sticky; top: calc(var(--header-h) + 28px); }
.risk-kicker { display: inline-block; font: 700 var(--fs-kicker)/1 var(--font-body); letter-spacing: .16em; text-transform: uppercase; color: var(--sector-ink, var(--azul)); margin-bottom: var(--space-3); }
.risk-title { font-size: var(--fs-h2); line-height: 1.14; margin: 0 0 var(--space-4); }
.risk-lead { font-size: var(--fs-lead); color: var(--text); line-height: 1.55; margin: 0; max-width: 42ch; }
.risk-punch {
  margin: var(--space-6) 0 0; padding-top: var(--space-5); border-top: 1px solid var(--line);
  font-size: 1.1rem; line-height: 1.5; color: var(--ink); max-width: 44ch;
}

.risk-body { display: flex; flex-direction: column; gap: clamp(var(--space-5), 3vw, var(--space-7)); }
.risk-group-label {
  display: inline-block; margin-bottom: var(--space-2);
  font: 700 var(--fs-small)/1 var(--font-body); letter-spacing: .04em; color: var(--sector-ink, var(--azul));
  background: var(--sector-soft, rgba(78,167,225,.12)); border-radius: 999px; padding: 5px 14px;
}
.risk-rows { list-style: none; margin: 0; padding: 0; }
.risk-row { display: flex; gap: var(--space-4); align-items: flex-start; padding: var(--space-4) 0; margin: 0; border-top: 1px solid var(--line); }
.risk-row:first-child { border-top: 0; }
.risk-mark {
  flex: none; width: 34px; height: 34px; border-radius: 50%; margin-top: 1px;
  display: inline-flex; align-items: center; justify-content: center;
  font: 700 16px/1 var(--font-body); color: var(--sector-ink, var(--azul));
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--sector, var(--celeste)) 60%, var(--line));
}
.risk-text { font-size: 1.06rem; line-height: 1.5; color: var(--ink); padding-top: 5px; }

@media (max-width: 860px) {
  .risk-split { grid-template-columns: 1fr; gap: var(--space-6); }
  .risk-head { position: static; }
}
</style>
