<script setup>
// Bloque de soluciones tipo "bento": 1 solucion destacada full-width + fila de cards con
// icono en gradiente y checklists. Contrato normalizado (cada pagina mapea su propia data):
//   items: [{ icon, title{es,en}, desc{es,en}, groups: [{ label{es,en}, items:[{es,en}] }] }]
// groups puede estar vacio (0), tener 1 (ej. "Incluye") o varios (ej. "Incluye" + "Ideal para").
defineProps({
  eyebrow: { type: [Object, String], default: '' },
  title: { type: [Object, String], default: '' },
  items: { type: Array, default: () => [] },
})
const t = useT()
const pad = (n) => String(n).padStart(2, '0')
const splitTwo = useSplitTwo()
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head center">
        <span v-if="eyebrow" class="kicker">{{ t(eyebrow) }}</span>
        <h2>{{ t(title) }}</h2>
      </div>

      <!-- Bento: 2 columnas; los items `wide` ocupan la fila completa (layout horizontal copy | checklist) -->
      <div v-if="items.length && items.length <= 5" class="sol-bento reveal">
        <template v-for="(s, idx) in items" :key="idx">
          <article v-if="s.wide" class="sol-featured b-full">
            <div class="sol-main">
              <div class="sol-top">
                <span class="sol-icon"><BaseIcon :name="s.icon" :size="26" /></span>
                <span class="sol-num">{{ pad(idx + 1) }}</span>
              </div>
              <h3><span v-for="(ln, i) in splitTwo(s.title)" :key="i">{{ ln }}</span></h3>
              <p class="sol-desc">{{ t(s.desc) }}</p>
            </div>
            <div v-if="s.groups && s.groups.length" class="sol-aside">
              <div v-for="(g, gi) in s.groups" :key="gi" class="sol-group">
                <span v-if="g.label" class="sol-list-label">{{ t(g.label) }}</span>
                <ul class="sol-list" :class="{ two: g.items.length > 3 }">
                  <li v-for="(e, i) in g.items" :key="i">{{ t(e) }}</li>
                </ul>
              </div>
            </div>
          </article>
          <article v-else class="sol-card">
            <div class="sol-top">
              <span class="sol-icon"><BaseIcon :name="s.icon" :size="24" /></span>
              <span class="sol-num sm">{{ pad(idx + 1) }}</span>
            </div>
            <h3><span v-for="(ln, i) in splitTwo(s.title)" :key="i">{{ ln }}</span></h3>
            <p class="sol-desc">{{ t(s.desc) }}</p>
            <div v-if="s.groups && s.groups.length" class="sol-includes">
              <div v-for="(g, gi) in s.groups" :key="gi" class="sol-group">
                <span v-if="g.label" class="sol-list-label">{{ t(g.label) }}</span>
                <ul class="sol-list" :class="{ two: g.items.length > 4 }">
                  <li v-for="(e, i) in g.items" :key="i">{{ t(e) }}</li>
                </ul>
              </div>
            </div>
          </article>
        </template>
      </div>

      <!-- Grid uniforme (6+ items): filas parejas, sin card flotando -->
      <div v-else-if="items.length" class="sol-grid uniform reveal">
        <article v-for="(s, idx) in items" :key="idx" class="sol-card">
          <div class="sol-top">
            <span class="sol-icon"><BaseIcon :name="s.icon" :size="24" /></span>
            <span class="sol-num sm">{{ pad(idx + 1) }}</span>
          </div>
          <h3><span v-for="(ln, i) in splitTwo(s.title)" :key="i">{{ ln }}</span></h3>
          <p class="sol-desc">{{ t(s.desc) }}</p>
          <div v-if="s.groups && s.groups.length" class="sol-includes">
            <div v-for="(g, gi) in s.groups" :key="gi" class="sol-group">
              <span v-if="g.label" class="sol-list-label">{{ t(g.label) }}</span>
              <ul class="sol-list">
                <li v-for="(e, i) in g.items" :key="i">{{ t(e) }}</li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Icono en tile gradiente (mismo lenguaje que .pillar-icon / .feature-icon) */
.sol-icon { display: inline-flex; width: 48px; height: 48px; flex: none; align-items: center; justify-content: center; border-radius: 13px; background: linear-gradient(150deg, rgba(58,120,255,.14), rgba(78,167,225,.10)); color: var(--azul); }
.sol-top { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); }
.sol-num { font: 400 1.9rem/1 var(--font-display); color: var(--celeste); letter-spacing: .02em; }
.sol-num.sm { font-size: 1.4rem; }
.sol-desc { color: var(--text); margin: 0 0 var(--space-4); }

/* Grupos + checklist */
.sol-group + .sol-group { margin-top: var(--space-5); }
.sol-list-label { display: block; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: var(--space-3); }
.sol-list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2); }
.sol-list.two { grid-template-columns: 1fr 1fr; gap: var(--space-2) var(--space-5); }
.sol-list li { position: relative; padding-left: 26px; margin: 0; font-size: .95rem; color: var(--text); }
.sol-list li::before { content: "\2713"; position: absolute; left: 0; top: 0; width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; font: 700 12px/1 var(--font-body); color: var(--azul); }

/* Destacada full-width */
.sol-featured { display: grid; grid-template-columns: 1.05fr .95fr; gap: clamp(var(--space-6), 4vw, var(--space-8)); align-items: center; background: linear-gradient(150deg, rgba(58,120,255,.06), rgba(78,167,225,.045)); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: clamp(var(--space-6), 4vw, var(--space-8)); margin-bottom: var(--space-5); }
.sol-featured h3 { font-family: var(--font-body); font-weight: 600; letter-spacing: -0.01em; font-size: clamp(1.3rem, 2vw, 1.6rem); line-height: 1.25; margin-bottom: var(--space-4); }
.sol-featured .sol-desc { font-size: 1.05rem; }
.sol-aside { align-self: stretch; }

/* Fila de cards */
.sol-grid { display: grid; gap: var(--space-5); grid-template-columns: repeat(auto-fit, minmax(258px, 1fr)); }
.sol-grid.uniform { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 900px) { .sol-grid.uniform { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .sol-grid.uniform { grid-template-columns: 1fr; } }
.sol-card { display: flex; flex-direction: column; background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--space-6); box-shadow: var(--shadow-xs); transition: box-shadow .2s var(--ease), transform .2s var(--ease), border-color .2s var(--ease); }
.sol-card:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); border-color: color-mix(in srgb, var(--celeste) 45%, var(--line)); }
.sol-card h3 { font-family: var(--font-body); font-weight: 600; letter-spacing: -0.01em; font-size: 1.12rem; line-height: 1.35; margin-bottom: var(--space-3); }
.sol-featured h3 span, .sol-card h3 span { display: block; }
.sol-card .sol-desc { font-size: .93rem; }
.sol-includes { margin-top: auto; padding-top: var(--space-4); }

/* Bento: 2 columnas; `.b-full` ocupa la fila completa (fila horizontal blanca, no destacada) */
.sol-bento { display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(var(--space-5), 3vw, var(--space-6)); align-items: stretch; }
.sol-bento .sol-includes { margin-top: var(--space-5); }
.sol-bento .b-full { grid-column: 1 / -1; margin-bottom: 0; background: var(--bg); align-self: start; }
@media (max-width: 700px) { .sol-bento { grid-template-columns: 1fr; } .sol-bento .b-full { grid-column: 1; } }

@media (max-width: 900px) {
  .sol-featured { grid-template-columns: 1fr; }
  .sol-aside { padding-top: var(--space-5); }
}
@media (max-width: 460px) {
  .sol-list.two { grid-template-columns: 1fr; }
  .sol-top { flex-wrap: wrap; }
}
</style>
