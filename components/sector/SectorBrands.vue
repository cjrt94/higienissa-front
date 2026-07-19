<script setup>
// Marcas relevantes: firma del ecosistema (Pacífica / Trazatex / Operissa) como
// secuencia. Cards con foto + rol; índice y acentos teñidos por sector. Borde neutro
// (regla de marca: nunca barra/borde eléctrico de acento).
defineProps({
  kicker: { type: [Object, String], default: '' },
  title: { type: [Object, String], default: '' },
  lead: { type: [Object, String], default: '' },
  items: { type: Array, default: () => [] }, // [{ name, eyebrow?, role?, desc, image, imageAlt, to, link }]
  note: { type: [Object, String], default: '' },
})
const t = useT()
const localePath = useLocalePath()
</script>

<template>
  <section id="marcas" class="section section-alt sector-brands">
    <div class="container">
      <div class="br-head">
        <span class="br-kicker">{{ t(kicker) }}</span>
        <h2 class="br-title">{{ t(title) }}</h2>
        <p v-if="lead" class="br-lead">{{ t(lead) }}</p>
      </div>

      <ol class="br-grid reveal">
        <li v-for="(b, i) in items" :key="i" class="br-item">
          <NuxtLink :to="localePath(b.to)" class="br-card">
            <span class="br-media">
              <img :src="b.image" :alt="t(b.imageAlt)" width="800" height="500" loading="lazy">
              <span class="br-step" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            </span>
            <span class="br-body">
              <span v-if="b.eyebrow" class="br-eyebrow">{{ t(b.eyebrow) }}</span>
              <span class="br-name">{{ t(b.name) }}</span>
              <span v-if="b.role" class="br-role">{{ t(b.role) }}</span>
              <span class="br-desc">{{ t(b.desc) }}</span>
              <span class="br-link">{{ t(b.link) }}</span>
            </span>
          </NuxtLink>
        </li>
      </ol>

      <p v-if="note" class="br-note">{{ t(note) }}</p>
    </div>
  </section>
</template>

<style scoped>
.br-head { max-width: 60ch; margin: 0 auto var(--space-7); text-align: center; }
.br-kicker { display: inline-block; font: 700 var(--fs-kicker)/1 var(--font-body); letter-spacing: .16em; text-transform: uppercase; color: var(--sector-ink, var(--azul)); margin-bottom: var(--space-3); }
.br-title { font-size: var(--fs-h2); line-height: 1.14; margin: 0 0 var(--space-4); }
.br-lead { font-size: var(--fs-lead); color: var(--text); line-height: 1.55; margin: 0 auto; max-width: 60ch; text-wrap: pretty; }

.br-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
.br-item { margin: 0; min-width: 0; }

.br-card {
  display: flex; flex-direction: column; height: 100%;
  background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden;
  box-shadow: var(--shadow-xs); color: inherit;
  transition: box-shadow .22s var(--ease), transform .22s var(--ease), border-color .22s var(--ease);
}
.br-card:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); border-color: color-mix(in srgb, var(--sector, var(--celeste)) 45%, var(--line)); }
.br-card:focus-visible { outline: none; box-shadow: inset 0 0 0 3px var(--electrico), var(--shadow-md); }

.br-media { position: relative; display: block; aspect-ratio: 16/10; overflow: hidden; background: var(--bg-alt); }
.br-media img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--dur-slow) var(--ease); }
.br-card:hover .br-media img, .br-card:focus-visible .br-media img { transform: scale(1.04); }
.br-step {
  position: absolute; top: var(--space-3); left: var(--space-3);
  display: inline-flex; align-items: center; justify-content: center; min-width: 34px; height: 34px; padding: 0 8px;
  font: 700 var(--fs-small)/1 var(--font-display); color: #fff; border-radius: 999px;
  background: color-mix(in srgb, var(--sector-ink, var(--azul)) 88%, #000);
  box-shadow: var(--shadow-sm);
}

.br-body { display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-5); flex: 1; }
.br-eyebrow { font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: var(--sector-ink, var(--azul)); }
.br-name { font: 600 var(--fs-h3) var(--font-display); color: var(--ink); line-height: 1.15; }
.br-role { font-weight: 700; color: var(--ink); font-size: 1rem; }
.br-desc { color: var(--text); font-size: var(--fs-body-sm); line-height: 1.5; flex: 1; }
/* Link text sits on white at ~16px/600 → needs ≥4.5:1. --electrico (#3A78FF) is ~3.96:1,
   so use a slightly darker blue (#2E63E0 ≈ 4.6:1). Solid electrico stays for filled CTAs. */
.br-link { display: inline-flex; align-items: center; gap: 6px; margin-top: var(--space-2); font-weight: 600; color: #2E63E0; }
.br-link::after { content: "→"; transition: transform var(--dur) var(--ease); }
.br-card:hover .br-link::after { transform: translateX(4px); }

.br-note { font-size: var(--fs-body-sm); color: var(--muted); border: 1px solid var(--line); background: var(--bg); padding: var(--space-4) var(--space-6); border-radius: var(--radius); max-width: 64ch; margin: var(--space-7) auto 0; text-align: center; }

@media (max-width: 860px) {
  .br-grid { grid-template-columns: 1fr; gap: var(--space-5); }
}
</style>
