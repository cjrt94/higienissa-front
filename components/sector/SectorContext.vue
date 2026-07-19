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
          <span
            v-if="variant === 'pillar'"
            class="ctx-ghost"
            aria-hidden="true"
          >{{ String(i + 1).padStart(2, '0') }}</span>

          <span class="ctx-marker" aria-hidden="true">
            <BaseIcon v-if="variant === 'pillar' && it.icon" :name="it.icon" :size="22" />
            <span v-else-if="variant === 'pillar'" class="ctx-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span v-else class="ctx-ask">?</span>
          </span>

          <div class="ctx-row-body">
            <span class="ctx-index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
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
.ctx-marker { flex: none; display: inline-flex; align-items: center; justify-content: center; }
.ctx-row-body { min-width: 0; }
.ctx-index { display: block; font: 700 var(--fs-kicker)/1 var(--font-body); letter-spacing: .16em; color: var(--sector-ink, var(--azul)); margin-bottom: var(--space-2); }
.ctx-row-title { font-size: var(--fs-h3); line-height: 1.2; margin: 0 0 var(--space-2); }
.ctx-row-text { margin: 0; color: var(--text); line-height: 1.55; }
.ctx-num { font: 700 1.15rem/1 var(--font-display); }

/* ── variant "ask": ledger de incógnitas en dos columnas, marcador + rail sutil ── */
.ctx-ledger.is-ask {
  display: grid; grid-template-columns: 1fr 1fr;
  column-gap: clamp(var(--space-5), 4vw, var(--space-8));
  border-top: 1px solid var(--line);
}
.is-ask .ctx-row {
  position: relative; display: grid; grid-template-columns: 44px 1fr;
  column-gap: var(--space-4); align-items: start; margin: 0;
  padding: var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--line);
  border-radius: var(--radius);
  transition: background var(--dur-fast, .16s) var(--ease-out, ease);
}
/* acento celeste que se revela al enfocar/pasar */
.is-ask .ctx-row::before {
  content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%) scaleY(0);
  width: 3px; height: 46%; border-radius: 3px;
  background: var(--sector-ink, var(--celeste));
  transition: transform var(--dur-fast, .16s) var(--ease-out, ease);
}
.is-ask .ctx-row:hover,
.is-ask .ctx-row:focus-within { background: var(--sector-soft, rgba(78,167,225,.12)); }
.is-ask .ctx-row:hover::before,
.is-ask .ctx-row:focus-within::before { transform: translateY(-50%) scaleY(1); }

.is-ask .ctx-marker {
  width: 40px; height: 40px; border-radius: var(--radius-chip, 14px);
  color: var(--sector-ink, var(--azul)); background: var(--bg);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--sector, var(--celeste)) 55%, var(--line));
  transition: background var(--dur-fast, .16s) var(--ease-out, ease),
              color var(--dur-fast, .16s) var(--ease-out, ease),
              box-shadow var(--dur-fast, .16s) var(--ease-out, ease);
}
.is-ask .ctx-row:hover .ctx-marker,
.is-ask .ctx-row:focus-within .ctx-marker {
  background: var(--sector-ink, var(--azul)); color: #fff;
  box-shadow: inset 0 0 0 1.5px var(--sector-ink, var(--azul));
}
.ctx-ask { font: 700 17px/1 var(--font-display); }
.is-ask .ctx-index { color: color-mix(in srgb, var(--sector-ink, var(--azul)) 70%, var(--muted)); }
.is-ask .ctx-row-text { font-size: 1.05rem; color: var(--ink); text-wrap: pretty; }

/* ── variant "pillar": tarjetas numeradas con marca de agua editorial ──────── */
.ctx-ledger.is-pillar { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(var(--space-5), 3vw, var(--space-6)); }
.is-pillar .ctx-row {
  position: relative; isolation: isolate; overflow: hidden;
  display: flex; flex-direction: column; gap: var(--space-4); margin: 0;
  padding: var(--space-6);
  background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  transition: transform var(--dur-fast, .16s) var(--ease-out, ease),
              box-shadow var(--dur-fast, .16s) var(--ease-out, ease),
              border-color var(--dur-fast, .16s) var(--ease-out, ease);
}
/* Sin barra de acento superior: regla de marca → cards con borde neutro (--line) solo.
   La estructura la dan la marca de agua numérica + el chip de ícono, no una barra de color. */
.is-pillar .ctx-row:hover {
  transform: translateY(-4px); box-shadow: var(--shadow-md);
  border-color: color-mix(in srgb, var(--sector, var(--celeste)) 40%, var(--line));
}
.ctx-ghost {
  position: absolute; z-index: 0; top: var(--space-2); right: var(--space-4);
  font: 800 clamp(3.4rem, 7vw, 4.8rem)/1 var(--font-display);
  color: color-mix(in srgb, var(--sector, var(--celeste)) 14%, transparent);
  pointer-events: none; user-select: none; letter-spacing: -.02em;
}
.is-pillar .ctx-marker {
  position: relative; z-index: 1;
  width: 48px; height: 48px; border-radius: var(--radius-chip);
  color: var(--sector-ink, var(--azul)); background: var(--sector-soft, rgba(78,167,225,.12));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--sector, var(--celeste)) 30%, transparent);
}
.is-pillar .ctx-row-body { position: relative; z-index: 1; }
.is-pillar .ctx-index { display: none; } /* el número ya vive en la marca de agua */

@media (max-width: 900px) {
  .ctx-ledger.is-pillar { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 860px) {
  .ctx-split { grid-template-columns: 1fr; gap: var(--space-6); }
}
@media (max-width: 620px) {
  .ctx-ledger.is-pillar { grid-template-columns: 1fr; gap: var(--space-5); }
  .ctx-ledger.is-ask { grid-template-columns: 1fr; }
  .is-ask .ctx-row { padding-left: var(--space-3); padding-right: var(--space-3); }
}
@media (prefers-reduced-motion: reduce) {
  .is-ask .ctx-row, .is-ask .ctx-marker, .is-ask .ctx-row::before,
  .is-pillar .ctx-row { transition: none; }
  .is-pillar .ctx-row:hover { transform: none; }
  .is-ask .ctx-row:hover::before,
  .is-ask .ctx-row:focus-within::before { transform: translateY(-50%) scaleY(1); }
}
</style>
