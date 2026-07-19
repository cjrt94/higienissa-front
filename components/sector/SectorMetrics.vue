<script setup>
// Indicadores gestionables: "panel de medición" enmarcado. Cada fila = chip de ícono
// (teñido por sector) + métrica + estado. El estado cualitativo solo se muestra si viene
// en el contenido (nunca se inventa); si no, un marcador gráfico de "medible".
const props = defineProps({
  kicker: { type: [Object, String], default: '' },
  title: { type: [Object, String], default: '' },
  source: { type: String, default: '' },
  items: { type: Array, default: () => [] }, // [{ icon?, label, state? }]
})
const t = useT()
const fallbackIcons = ['chart', 'target', 'activity', 'scan', 'shield', 'check']
const rows = computed(() => props.items.map((it, i) => ({
  icon: it.icon || fallbackIcons[i % fallbackIcons.length],
  label: it.label,
  state: it.state || null,
})))
</script>

<template>
  <section class="section section-alt sector-metrics">
    <div class="container">
      <div class="mt-head">
        <span class="mt-kicker">{{ t(kicker) }}</span>
        <h2 class="mt-title">{{ t(title) }}</h2>
      </div>

      <div class="mt-board reveal">
        <div class="mt-bar">
          <span class="mt-bar-kicker">{{ $t('sectorUi.measurementPanel') }}</span>
          <span v-if="source" class="mt-source"><span class="mt-dot" aria-hidden="true" />{{ source }}</span>
        </div>
        <ul class="mt-rows">
          <li v-for="(r, i) in rows" :key="i" class="mt-row">
            <span class="mt-icon" aria-hidden="true"><BaseIcon :name="r.icon" :size="22" /></span>
            <span class="mt-label">{{ t(r.label) }}</span>
            <span v-if="r.state" class="mt-state">{{ t(r.state) }}</span>
            <span v-else class="mt-flag" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mt-head { max-width: 60ch; margin: 0 auto var(--space-7); text-align: center; }
.mt-kicker { display: inline-block; font: 700 var(--fs-kicker)/1 var(--font-body); letter-spacing: .16em; text-transform: uppercase; color: var(--sector-ink, var(--azul)); margin-bottom: var(--space-3); }
.mt-title { font-size: var(--fs-h2); line-height: 1.14; margin: 0; }

.mt-board { max-width: 880px; margin: 0 auto; background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); overflow: hidden; }
.mt-bar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); padding: var(--space-4) var(--space-5); background: var(--sector-soft, rgba(78,167,225,.12)); border-bottom: 1px solid var(--line); }
.mt-bar-kicker { font: 700 var(--fs-kicker)/1 var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: var(--sector-ink, var(--azul)); }
.mt-source { display: inline-flex; align-items: center; gap: 8px; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.mt-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--sector, var(--celeste)); }

.mt-rows { list-style: none; margin: 0; padding: 0; }
.mt-row { display: grid; grid-template-columns: 46px 1fr auto; align-items: center; gap: var(--space-4); padding: var(--space-4) var(--space-5); margin: 0; border-top: 1px solid var(--line-soft); }
.mt-row:first-child { border-top: 0; }
.mt-icon { width: 46px; height: 46px; border-radius: var(--radius-chip); display: inline-flex; align-items: center; justify-content: center; background: var(--sector-soft, rgba(78,167,225,.12)); color: var(--sector-ink, var(--azul)); }
.mt-label { font: 600 1.02rem var(--font-body); color: var(--ink); }
.mt-state { font: 600 var(--fs-small) var(--font-body); color: var(--sector-ink, var(--azul)); background: var(--sector-soft, rgba(78,167,225,.12)); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--sector, var(--celeste)) 34%, transparent); border-radius: 999px; padding: 5px 12px; white-space: nowrap; }
.mt-flag { width: 26px; height: 26px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: var(--sector-ink, var(--azul)); box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--sector, var(--celeste)) 55%, var(--line)); }
.mt-flag svg { width: 14px; height: 14px; }

@media (max-width: 620px) {
  .mt-row { grid-template-columns: 40px 1fr; }
  .mt-icon { width: 40px; height: 40px; }
  .mt-state, .mt-flag { grid-column: 2; justify-self: start; }
}
</style>
