<script setup>
// Documento legal premium (aviso legal + privacidad). Layout a dos columnas:
// índice sticky con scroll-spy + contenido long-form. Bilingüe vía useT().
// El hero de tope pasa POR DETRÁS del navbar transparente: como su clase NO es
// .hero/.page-hero, replicamos aquí el margin-top negativo + padding compensado
// (equivalente a la regla de site.css) en <style scoped>.
const props = defineProps({
  page: { type: Object, required: true },
  // Créditos de imágenes (solo aviso legal). Se renderizan como sección final
  // y entran en el índice. Shape: [{ use:{es,en}, author, license, source }]
  credits: { type: Array, default: () => [] },
})

const t = useT()
const { locale } = useI18n()

// --- Etiquetas de UI (bilingües, presentación; no tocan el texto legal) ---
const tocLabel = { es: 'En esta página', en: 'On this page' }
const tocAria = { es: 'Índice', en: 'Table of contents' }
const updatedLabel = { es: 'Última actualización', en: 'Last updated' }
const readLabel = { es: 'Documento legal', en: 'Legal document' }
const topLabel = { es: 'Volver arriba', en: 'Back to top' }
const creditsHeading = { es: 'Créditos de imágenes', en: 'Image credits' }
const creditsIntro = {
  es: 'Algunas imágenes de terceros se utilizan bajo licencia Creative Commons, con atribución a sus autores:',
  en: 'Some third-party images are used under a Creative Commons license, with attribution to their authors:',
}
const sourceLabel = { es: 'ver fuente', en: 'view source' }

const CREDITS_ID = 'creditos'

// --- Índice: sección legal + (opcional) créditos ---
const items = computed(() => {
  const rows = props.page.sections.map((sec, i) => ({ id: `s${i + 1}`, heading: sec.heading }))
  if (props.credits.length) rows.push({ id: CREDITS_ID, heading: creditsHeading })
  return rows
})

// Separa "N. Título" en número + etiqueta para maquetar la numeración.
function splitNum(str) {
  const m = /^\s*(\d+)\.\s*(.*)$/.exec(str)
  return m ? { num: m[1], label: m[2] } : { num: '', label: str }
}
function headingParts(heading) {
  return splitNum(t(heading))
}

// Segmenta un párrafo resaltando placeholders [ASÍ] y linkificando emails,
// sin alterar el texto. Devuelve tramos { t, kind: 'text'|'ph'|'mail' }.
const TOKEN = /(\[[^\]]+\]|[\w.+-]+@[\w.-]+\.\w{2,})/g
function segments(str) {
  const out = []
  let last = 0
  let m
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(str))) {
    if (m.index > last) out.push({ t: str.slice(last, m.index), kind: 'text' })
    out.push({ t: m[0], kind: m[0].startsWith('[') ? 'ph' : 'mail' })
    last = m.index + m[0].length
  }
  if (last < str.length) out.push({ t: str.slice(last), kind: 'text' })
  return out
}

// --- Fecha de actualización (presentación) ---
const updatedText = computed(() => {
  if (!props.page.updatedAt) return ''
  const d = new Date(`${props.page.updatedAt}T00:00:00`)
  if (Number.isNaN(d.getTime())) return props.page.updatedAt
  return new Intl.DateTimeFormat(locale.value === 'en' ? 'en-US' : 'es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(d)
})

// --- Índice colapsable en teléfono ---
// SSR/desktop: abierto (contenido siempre visible, funciona sin JS). Tras hidratar,
// en ≤860px se colapsa a un <details> con resumen "En esta página".
const tocOpen = ref(true)
// ¿estamos en el breakpoint colapsable (≤860px)? Gobierna la afordancia de
// teclado del <summary>: en desktop es un rótulo estático (no focuseable), en
// mobile es el disparador real del <details>.
const isNarrow = ref(false)
let mq = null
function syncToc() {
  if (!mq) return
  isNarrow.value = mq.matches
  tocOpen.value = !mq.matches
}
function onTocToggle(e) {
  tocOpen.value = e.target.open
}

// --- Scroll-spy: resalta la sección SUPERIOR visible del documento ---
// Mantiene el conjunto de secciones intersectantes y activa la de menor top,
// para que el índice acierte "dónde estoy" tanto al bajar como al subir.
const activeId = ref('')
let observer = null
let targets = []
const visibleSecs = new Set()

// Fallback de fin de página: la última sección (Créditos / último ítem) suele ser
// más corta que la banda inferior del rootMargin y nunca se vuelve la "superior
// visible", así que al llegar al fondo forzamos su id como activo.
function onScroll() {
  if (!targets.length) return
  const scrolledBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8
  if (scrolledBottom) activeId.value = targets[targets.length - 1].id
}

onMounted(() => {
  mq = window.matchMedia('(max-width: 860px)')
  syncToc()
  mq.addEventListener('change', syncToc)

  targets = Array.from(document.querySelectorAll('[data-legal-sec]'))
  if (!targets.length) return
  activeId.value = targets[0].id
  observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) visibleSecs.add(e.target)
      else visibleSecs.delete(e.target)
    }
    let top = null
    for (const el of visibleSecs) {
      if (!top || el.getBoundingClientRect().top < top.getBoundingClientRect().top) top = el
    }
    if (top) activeId.value = top.id
    onScroll()
  }, { rootMargin: '-96px 0px -68% 0px', threshold: 0 })
  targets.forEach((el) => observer.observe(el))
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
  if (mq) mq.removeEventListener('change', syncToc)
  window.removeEventListener('scroll', onScroll)
})

function onTocClick(id) {
  activeId.value = id
  // En el breakpoint colapsable (≤860px) el índice es un <details>: al saltar a
  // un ancla lo cerramos para que no quede el índice largo expandido por encima
  // del contenido cuando el usuario vuelve a subir (reporte de Rowena R4, punto 2).
  if (isNarrow.value) tocOpen.value = false
}
</script>

<template>
  <div id="top" class="legal">
    <header class="legal-hero">
      <div class="container">
        <span class="legal-kicker">{{ t(page.hero.eyebrow) || t(readLabel) }}</span>
        <h1 class="legal-title">{{ t(page.hero.title) }}</h1>
        <p v-if="page.hero.lead" class="legal-lead">{{ t(page.hero.lead) }}</p>
        <p v-if="updatedText" class="legal-meta">
          <span class="legal-meta-dot" aria-hidden="true"></span>
          {{ t(updatedLabel) }}: <time :datetime="page.updatedAt">{{ updatedText }}</time>
        </p>
      </div>
    </header>

    <div class="container legal-layout">
      <details class="legal-toc" :open="tocOpen" @toggle="onTocToggle">
        <summary class="toc-summary" :tabindex="isNarrow ? null : -1">
          <span class="toc-label">{{ t(tocLabel) }}</span>
          <svg class="toc-chevron" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </summary>
        <nav class="toc-nav" :aria-label="t(tocAria)">
          <ol>
            <li v-for="it in items" :key="it.id">
              <a
                :href="`#${it.id}`"
                :class="{ 'is-active': activeId === it.id }"
                @click="onTocClick(it.id)"
              >
                <span class="toc-num" aria-hidden="true">{{ headingParts(it.heading).num || '·' }}</span>
                <span class="toc-text">{{ headingParts(it.heading).label }}</span>
              </a>
            </li>
          </ol>
        </nav>
      </details>

      <article class="legal-content">
        <section
          v-for="(sec, i) in page.sections"
          :id="`s${i + 1}`"
          :key="i"
          data-legal-sec
          class="legal-section"
        >
          <h2>
            <span v-if="headingParts(sec.heading).num" class="s-num" aria-hidden="true">{{ headingParts(sec.heading).num }}</span>
            <span class="s-label">{{ headingParts(sec.heading).label }}</span>
          </h2>
          <p v-for="(par, j) in sec.body" :key="j">
            <template v-for="(seg, k) in segments(t(par))" :key="k">
              <mark v-if="seg.kind === 'ph'" class="ph">{{ seg.t }}</mark>
              <a v-else-if="seg.kind === 'mail'" class="mail" :href="`mailto:${seg.t}`">{{ seg.t }}</a>
              <template v-else>{{ seg.t }}</template>
            </template>
          </p>
        </section>

        <section
          v-if="credits.length"
          :id="CREDITS_ID"
          data-legal-sec
          class="legal-section legal-credits-sec"
        >
          <h2><span class="s-label">{{ t(creditsHeading) }}</span></h2>
          <p>{{ t(creditsIntro) }}</p>
          <ul class="credits-list">
            <li v-for="(c, i) in credits" :key="i">
              <span class="credit-use">{{ t(c.use) }}</span>
              <span class="credit-meta">{{ c.author }} · {{ c.license }}</span>
              <a class="credit-src" :href="c.source" target="_blank" rel="noopener noreferrer">
                {{ t(sourceLabel) }}
                <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M6 3h7v7M13 3 4 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </a>
            </li>
          </ul>
        </section>

        <p class="legal-toplink">
          <a href="#top">
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M8 13V4M4 7l4-3 4 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ t(topLabel) }}
          </a>
        </p>
      </article>
    </div>
  </div>
</template>

<style scoped>
/* ---------- Hero de tope: pasa por detrás del navbar transparente ---------- */
/* Replica la regla de site.css para .hero/.page-hero (esta clase no matchea). */
.legal-hero {
  position: relative;
  margin-top: calc(-1 * var(--header-h));
  padding-top: calc(var(--header-h) + clamp(var(--space-7), 6vw, var(--space-9)));
  padding-bottom: clamp(var(--space-6), 4vw, var(--space-8));
  background:
    radial-gradient(120% 140% at 8% -10%, rgba(78, 167, 225, 0.10), transparent 60%),
    linear-gradient(180deg, var(--bg-alt), var(--bg));
  border-bottom: 1px solid var(--line);
}
.legal-kicker {
  display: inline-block;
  font: 700 var(--fs-kicker)/1 var(--font-body);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--azul);
  margin-bottom: var(--space-3);
}
.legal-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--fs-h1);
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin: 0;
  max-width: 20ch;
}
.legal-lead {
  margin: var(--space-4) 0 0;
  max-width: 62ch;
  font-size: var(--fs-lead);
  line-height: 1.55;
  color: var(--muted);
}
.legal-meta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin: var(--space-6) 0 0;
  font-size: var(--fs-small);
  color: var(--muted);
}
.legal-meta time { color: var(--text); font-weight: 600; }
.legal-meta-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--celeste);
  box-shadow: 0 0 0 4px rgba(78, 167, 225, 0.16);
}

/* ---------- Layout a dos columnas ---------- */
.legal-layout {
  display: grid;
  grid-template-columns: minmax(0, 15rem) minmax(0, 1fr);
  gap: clamp(var(--space-6), 5vw, var(--space-9));
  align-items: start;
  padding-top: clamp(var(--space-7), 5vw, var(--space-9));
  padding-bottom: clamp(var(--space-8), 8vw, var(--space-10));
}

/* ---------- Índice sticky ---------- */
.legal-toc {
  position: sticky;
  top: calc(var(--header-h) + var(--space-5));
  align-self: start;
  max-height: calc(100vh - var(--header-h) - var(--space-7));
  overflow-y: auto;
}
/* En desktop el <details> queda siempre abierto: el resumen actúa como rótulo
   estático (sin marcador, sin chevron, no clickeable). En ≤860px se activa. */
.toc-summary {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: 0 var(--space-3) var(--space-3);
  cursor: default;
  pointer-events: none;
}
.toc-summary::-webkit-details-marker { display: none; }
.toc-label {
  font: 700 var(--fs-kicker)/1 var(--font-body);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}
.toc-chevron {
  display: none;
  flex: none;
  color: var(--muted);
  transition: transform var(--dur-fast) var(--ease-out);
}
.legal-toc ol { list-style: none; margin: 0; padding: 0; }
.legal-toc a {
  display: flex;
  gap: var(--space-3);
  align-items: baseline;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--muted);
  font-size: var(--fs-body-sm);
  line-height: 1.35;
  transition: color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out);
}
.legal-toc a:hover { color: var(--ink); background: var(--bg-alt); }
.legal-toc a.is-active { color: var(--azul); background: var(--bg-alt); font-weight: 600; }
.toc-num {
  flex: none;
  min-width: 1.25em;
  font-variant-numeric: tabular-nums;
  font-size: var(--fs-small);
  font-weight: 600;
  color: var(--gris-marca);
  transition: color var(--dur-fast) var(--ease-out);
}
.legal-toc a.is-active .toc-num { color: var(--azul); }

/* ---------- Contenido long-form ---------- */
.legal-content {
  max-width: 68ch;
  color: var(--text);
}
.legal-section { scroll-margin-top: calc(var(--header-h) + var(--space-5)); }
.legal-section + .legal-section {
  margin-top: var(--space-7);
  padding-top: var(--space-7);
  border-top: 1px solid var(--line);
}
.legal-content h2 {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin: 0 0 var(--space-4);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--fs-h3);
  line-height: 1.2;
  letter-spacing: -0.005em;
  color: var(--ink);
}
.s-num {
  flex: none;
  font-variant-numeric: tabular-nums;
  font-size: var(--fs-body-sm);
  font-weight: 700;
  color: var(--azul);
  padding-top: 0.15em;
}
.s-num::after { content: ""; }
.legal-content p {
  margin: 0 0 var(--space-4);
  line-height: 1.75;
  font-size: var(--fs-body);
}
.legal-content p:last-child { margin-bottom: 0; }

/* Placeholders "a completar": resalte sutil azul, sin bordes de acento. */
/* Placeholders largos ([DISTRITO JUDICIAL / CIUDAD]) deben poder partir línea:
   sin nowrap y con overflow-wrap para no forzar scroll horizontal en ≤360px. */
.ph {
  background: rgba(28, 42, 135, 0.07);
  color: var(--azul);
  font-weight: 600;
  padding: 0.05em 0.36em;
  border-radius: 4px;
  overflow-wrap: anywhere;
}
.mail {
  color: var(--azul);
  text-decoration: none;
  border-bottom: 1px solid rgba(28, 42, 135, 0.25);
  transition: border-color var(--dur-fast) var(--ease-out);
}
.mail:hover { border-bottom-color: var(--azul); }

/* ---------- Créditos de imágenes ---------- */
.credits-list { list-style: none; margin: var(--space-2) 0 0; padding: 0; }
.credits-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-1) var(--space-3);
  padding: var(--space-3) 0;
  font-size: var(--fs-small);
  line-height: 1.5;
}
.credits-list li + li { border-top: 1px solid var(--line); }
.credit-use { font-weight: 600; color: var(--ink); }
.credit-meta { color: var(--muted); }
.credit-src {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  color: var(--azul);
  text-decoration: none;
  white-space: nowrap;
}
.credit-src:hover { text-decoration: underline; }
.credit-src svg { opacity: 0.8; }

/* ---------- Back to top ---------- */
.legal-toplink { margin: var(--space-7) 0 0; padding-top: var(--space-5); border-top: 1px solid var(--line); }
.legal-toplink a {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-small);
  font-weight: 600;
  color: var(--muted);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-out);
}
.legal-toplink a:hover { color: var(--azul); }

/* ---------- Responsive: índice colapsable arriba del contenido ---------- */
@media (max-width: 860px) {
  .legal-layout { grid-template-columns: 1fr; gap: var(--space-6); }
  .legal-toc {
    position: static;
    max-height: none;
    overflow: visible;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--bg-alt);
  }
  /* El <details> arranca cerrado (tocOpen=false tras hidratar): el contenido
     queda accesible de inmediato sin un índice largo empujándolo hacia abajo. */
  .toc-summary {
    pointer-events: auto;
    cursor: pointer;
    padding: var(--space-3) var(--space-4);
    min-height: 44px;
  }
  .toc-chevron { display: block; }
  .legal-toc[open] .toc-chevron { transform: rotate(180deg); }
  .toc-nav { padding: 0 var(--space-2) var(--space-2); }
  /* Área táctil ≥44px por ítem: el índice es la navegación principal en mobile. */
  .legal-toc a {
    align-items: center;
    padding: var(--space-3);
    min-height: 44px;
  }
  .legal-toc a.is-active,
  .legal-toc a:hover { background: var(--bg); }
}

@media (prefers-reduced-motion: reduce) {
  .legal-toc a, .toc-num, .toc-chevron, .mail, .legal-toplink a { transition: none; }
}
</style>
