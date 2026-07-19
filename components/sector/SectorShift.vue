<script setup>
// "Qué cambia": banda a sangre (momento visual, foto + overlay de marca + glow e
// ícono-motivo de sector) seguida del ledger de transformación.
//  · before presente          → contraste "antes → ahora" (recesivo vs dominante)
//  · items con title          → tríptico numerado
//  · items solo texto         → ledger de ganancias en dos columnas
const props = defineProps({
  icon: { type: String, default: '' },
  eyebrow: { type: [Object, String], default: '' },
  title: { type: [Object, String], default: '' },
  statement: { type: [Object, String], default: '' },
  image: { type: String, default: '' },
  imageAlt: { type: [Object, String], default: '' },
  before: { type: Object, default: null },     // { label, statement }
  afterLabel: { type: [Object, String], default: '' },
  items: { type: Array, default: () => [] },   // [{ text } | { title, text }]
})
const t = useT()
const mode = computed(() => {
  if (props.before) return 'fromto'
  if (props.items[0] && props.items[0].title) return 'trio'
  return 'gains'
})
</script>

<template>
  <section class="shift-band" :class="{ 'no-image': !image }">
    <img v-if="image" :src="image" :alt="t(imageAlt) || ''" class="sb-img" loading="lazy">
    <span class="sb-scrim" aria-hidden="true" />
    <span class="sb-glow" aria-hidden="true" />
    <BaseIcon v-if="icon" :name="icon" :size="440" :stroke-width="0.8" class="sb-motif" aria-hidden="true" />
    <div class="container sb-inner reveal">
      <span class="sb-eyebrow">{{ t(eyebrow) }}</span>
      <h2 class="sb-title">{{ t(title) }}</h2>
      <p class="sb-statement">{{ t(statement) }}</p>
    </div>
  </section>

  <section class="section sector-shift-ledger">
    <div class="container">
      <!-- ANTES → AHORA -->
      <div v-if="mode === 'fromto'" class="ft reveal">
        <div class="ft-before">
          <span class="ft-tag">{{ t(before.label) }}</span>
          <p class="ft-statement">{{ t(before.statement) }}</p>
        </div>
        <span class="ft-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
        <div class="ft-after">
          <span class="ft-tag-strong">{{ t(afterLabel) }}</span>
          <ul class="gain-list">
            <li v-for="(it, i) in items" :key="i">
              <span class="gain-check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg></span>
              <span>{{ t(it.text) }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- TRÍPTICO NUMERADO -->
      <ol v-else-if="mode === 'trio'" class="trio reveal">
        <li v-for="(it, i) in items" :key="i" class="trio-item">
          <span class="trio-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="trio-title">{{ t(it.title) }}</h3>
          <p class="trio-text">{{ t(it.text) }}</p>
        </li>
      </ol>

      <!-- LEDGER DE GANANCIAS -->
      <ul v-else class="gains reveal">
        <li v-for="(it, i) in items" :key="i" class="gains-row">
          <span class="gain-check solid" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5" /></svg></span>
          <span>{{ t(it.text) }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.shift-band { position: relative; overflow: hidden; isolation: isolate; color: #fff; padding: clamp(var(--space-8), 9vw, 128px) 0; }
.sb-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; }
.shift-band.no-image { background: linear-gradient(135deg, var(--bg-deep), #1a2a6b); }
.sb-scrim { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(9,14,32,.66), rgba(9,14,32,.82)); }
.sb-glow { position: absolute; inset: 0; z-index: -1; background: radial-gradient(50% 70% at 50% -8%, color-mix(in srgb, var(--sector, var(--celeste)) 50%, transparent), transparent 60%); opacity: .5; mix-blend-mode: screen; }
.sb-motif { position: absolute; right: -3%; bottom: -18%; color: var(--sector, var(--celeste)); opacity: .1; z-index: -1; }

.sb-inner { position: relative; max-width: 60ch; margin: 0 auto; text-align: center; }
.sb-eyebrow { display: inline-block; font: 700 var(--fs-kicker)/1 var(--font-body); letter-spacing: .18em; text-transform: uppercase; color: color-mix(in srgb, var(--sector, var(--celeste)) 70%, #fff); margin-bottom: var(--space-4); }
.sb-title { color: #fff; font-size: clamp(1.7rem, 3vw, 2.6rem); line-height: 1.12; margin: 0 0 var(--space-4); text-wrap: balance; }
.sb-statement { font-size: clamp(1.1rem, 1.6vw, 1.35rem); line-height: 1.55; color: rgba(255,255,255,.9); margin: 0; text-wrap: pretty; }


/* Antes → ahora */
.ft { display: grid; grid-template-columns: .95fr auto 1.5fr; align-items: stretch; gap: clamp(var(--space-4), 3vw, var(--space-7)); }
.ft-before { display: flex; flex-direction: column; justify-content: center; background: var(--bg-alt); color: var(--muted); border: 1px solid var(--line); border-radius: var(--radius); padding: clamp(var(--space-6), 3vw, var(--space-7)); min-height: 220px; }
.ft-tag { display: inline-block; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: var(--space-3); }
.ft-statement { margin: 0; font-size: 1.05rem; line-height: 1.55; }
.ft-arrow { color: var(--sector-ink, var(--azul)); align-self: center; }
.ft-arrow svg { width: 40px; height: 40px; display: block; }
.ft-after { background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: clamp(var(--space-6), 3vw, var(--space-7)); box-shadow: var(--shadow-lg); }
.ft-tag-strong { display: inline-block; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: var(--sector-ink, var(--azul)); margin-bottom: var(--space-4); }
.gain-list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-4); }
.gain-list li { display: flex; gap: var(--space-3); align-items: center; color: var(--ink); font: 600 1.1rem var(--font-body); margin: 0; }
.gain-check { flex: none; width: 28px; height: 28px; border-radius: 50%; color: var(--sector-ink, var(--azul)); box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--sector, var(--celeste)) 60%, var(--line)); display: inline-flex; align-items: center; justify-content: center; }
.gain-check svg { width: 15px; height: 15px; }

/* Tríptico numerado */
.trio { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(var(--space-6), 4vw, var(--space-8)); }
.trio-item { padding-top: var(--space-5); border-top: 2px solid color-mix(in srgb, var(--sector, var(--celeste)) 30%, var(--line)); margin: 0; }
.trio-num { display: block; font: 600 1.6rem/1 var(--font-display); color: var(--sector-ink, var(--azul)); margin-bottom: var(--space-4); letter-spacing: .01em; }
.trio-title { font-size: var(--fs-h3); line-height: 1.18; margin: 0 0 var(--space-3); }
.trio-text { margin: 0; color: var(--text); line-height: 1.5; }

/* Ganancias en dos columnas */
.gains { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4) var(--space-7); max-width: 60rem; margin-inline: auto; }
.gains-row { display: flex; gap: var(--space-3); align-items: center; margin: 0; color: var(--ink); font: 600 1.06rem var(--font-body); }
.gain-check.solid { color: #fff; background: var(--sector-ink, var(--azul)); box-shadow: none; }

@media (max-width: 860px) {
  .ft { grid-template-columns: 1fr; }
  .ft-arrow { transform: rotate(90deg); justify-self: center; }
  .trio { grid-template-columns: 1fr; gap: var(--space-6); }
  .gains { grid-template-columns: 1fr; gap: var(--space-4); }
}
</style>
