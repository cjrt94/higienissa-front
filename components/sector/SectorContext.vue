<script setup>
// Contexto del sector: split editorial (foto + copy) con un ledger de detalle debajo.
// variant 'ask'  → filas-pregunta (lo que hoy no se sabe / costo oculto)
// variant 'pillar' → filas tituladas (pilares del desafío)
defineProps({
  kicker: { type: [Object, String], default: '' },
  title: { type: [Object, String], default: '' },
  lead: { type: [Object, String], default: '' },
  image: { type: String, default: '' },
  imageAlt: { type: [Object, String], default: '' },
  label: { type: [Object, String], default: '' }, // rótulo opcional del ledger (ask)
  items: { type: Array, default: () => [] },       // [{ title?, text, icon? }]
  variant: { type: String, default: 'ask' },
})
const t = useT()
</script>

<template>
  <section class="section section-alt sector-context">
    <div class="container">
      <div class="ctx-split">
        <figure class="ctx-media reveal">
          <img :src="image" :alt="t(imageAlt)" width="1040" height="900" loading="lazy">
          <figcaption v-if="label" class="ctx-flag">{{ t(label) }}</figcaption>
        </figure>
        <div class="ctx-copy">
          <span class="ctx-kicker">{{ t(kicker) }}</span>
          <h2 class="ctx-title">{{ t(title) }}</h2>
          <p class="ctx-lead">{{ t(lead) }}</p>
        </div>
      </div>

      <ol class="ctx-ledger reveal" :class="`is-${variant}`">
        <li v-for="(it, i) in items" :key="i" class="ctx-row">
          <span class="ctx-marker" aria-hidden="true">
            <BaseIcon v-if="variant === 'pillar' && it.icon" :name="it.icon" :size="22" />
            <span v-else-if="variant === 'pillar'" class="ctx-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span v-else class="ctx-ask">?</span>
          </span>
          <div class="ctx-row-body">
            <h3 v-if="it.title" class="ctx-row-title">{{ t(it.title) }}</h3>
            <p class="ctx-row-text">{{ t(it.text) }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.ctx-split { display: grid; grid-template-columns: .92fr 1.08fr; gap: clamp(var(--space-6), 5vw, var(--space-9)); align-items: center; }

.ctx-media { position: relative; margin: 0; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md); aspect-ratio: 4/3.5; background: var(--bg); }
.ctx-media img { width: 100%; height: 100%; object-fit: cover; }
.ctx-flag {
  position: absolute; left: var(--space-4); bottom: var(--space-4);
  font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .1em; text-transform: uppercase; color: #fff;
  background: color-mix(in srgb, var(--bg-deep) 82%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--sector, var(--celeste)) 50%, transparent);
  padding: 8px 14px; border-radius: 999px;
}

.ctx-copy { min-width: 0; }
.ctx-kicker { display: inline-block; font: 700 var(--fs-kicker)/1 var(--font-body); letter-spacing: .16em; text-transform: uppercase; color: var(--sector-ink, var(--azul)); margin-bottom: var(--space-3); }
.ctx-title { font-size: var(--fs-h2); line-height: 1.14; margin: 0 0 var(--space-4); }
.ctx-lead { font-size: var(--fs-lead); color: var(--text); line-height: 1.55; margin: 0; max-width: 52ch; text-wrap: pretty; }

.ctx-ledger { list-style: none; margin: clamp(var(--space-7), 5vw, var(--space-8)) 0 0; padding: 0; }
.ctx-ledger.is-pillar { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(var(--space-5), 3vw, var(--space-7)); }
.ctx-ledger.is-ask { max-width: 78ch; }

.ctx-row { display: flex; gap: var(--space-4); align-items: flex-start; margin: 0; }
.is-ask .ctx-row { padding: var(--space-4) 0; border-top: 1px solid var(--line); }
.is-ask .ctx-row:first-child { border-top: 0; }
.is-pillar .ctx-row { flex-direction: column; gap: var(--space-4); padding-top: var(--space-5); border-top: 2px solid color-mix(in srgb, var(--sector, var(--celeste)) 30%, var(--line)); }

.ctx-marker { flex: none; display: inline-flex; align-items: center; justify-content: center; }
.is-ask .ctx-marker { width: 34px; height: 34px; border-radius: 50%; color: var(--sector-ink, var(--azul)); box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--sector, var(--celeste)) 60%, var(--line)); margin-top: 2px; }
.ctx-ask { font: 700 15px/1 var(--font-body); }
.is-pillar .ctx-marker { width: 48px; height: 48px; border-radius: var(--radius-chip); color: var(--sector-ink, var(--azul)); background: var(--sector-soft, rgba(78,167,225,.12)); }
.ctx-num { font: 700 1.15rem/1 var(--font-display); }

.ctx-row-body { min-width: 0; }
.ctx-row-title { font-size: var(--fs-h3); line-height: 1.2; margin: 0 0 var(--space-2); }
.ctx-row-text { margin: 0; color: var(--text); line-height: 1.5; }
.is-ask .ctx-row-text { font-size: 1.05rem; color: var(--ink); }

@media (max-width: 860px) {
  .ctx-split { grid-template-columns: 1fr; gap: var(--space-6); }
  .ctx-ledger.is-pillar { grid-template-columns: 1fr; gap: var(--space-6); }
}
</style>
