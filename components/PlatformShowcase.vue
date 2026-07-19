<script setup>
// "La plataforma en vivo" — scrollytelling: el dashboard queda fijo (sticky) a la
// izquierda y cambia de captura según el paso que entra en el centro del viewport,
// mientras los pasos scrollean a la derecha. Datos bilingües { es, en } vía useT.
const props = defineProps({ data: { type: Object, required: true } })
const t = useT()
const active = ref(0)
const rootEl = ref(null)
const steps = computed(() => props.data.steps || [])
let io

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined' || !rootEl.value) return
  const nodes = rootEl.value.querySelectorAll('.pf-step')
  // Un paso se activa cuando cruza la banda central del viewport (±40%).
  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) active.value = Number(e.target.dataset.index)
    })
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 })
  nodes.forEach((n) => io.observe(n))
})
onBeforeUnmount(() => io && io.disconnect())
</script>

<template>
  <section class="section platform">
    <div class="container">
      <div class="section-head pf-head">
        <span class="kicker">{{ t(data.kicker) }}</span>
        <h2>{{ t(data.title) }}</h2>
        <p v-if="data.lead" class="lead">{{ t(data.lead) }}</p>
      </div>

      <div ref="rootEl" class="pf-scrolly">
        <!-- Panel fijo: el dashboard que cambia de vista -->
        <div class="pf-sticky">
          <div class="pf-device">
            <span class="pf-chrome" aria-hidden="true"><i></i><i></i><i></i>
              <span class="pf-url">dashboard.asisidtrak.com</span>
            </span>
            <div class="pf-screens">
              <img
                v-for="(s, i) in steps" :key="i" :src="s.src" :alt="t(s.alt)"
                width="1400" height="648" loading="lazy" decoding="async"
                class="pf-screen" :class="{ on: active === i }"
              >
            </div>
          </div>
          <div class="pf-dots" aria-hidden="true">
            <span v-for="(s, i) in steps" :key="i" :class="{ on: active === i }" />
          </div>
        </div>

        <!-- Pasos que scrollean -->
        <ol class="pf-steps">
          <li
            v-for="(s, i) in steps" :key="i" :data-index="i"
            class="pf-step" :class="{ 'is-active': active === i }"
          >
            <span class="pf-step-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="pf-step-tag">{{ t(s.tag) }}</span>
            <h3>{{ t(s.title) }}</h3>
            <p>{{ t(s.text) }}</p>
          </li>
        </ol>
      </div>

      <!-- Cierre: diferenciadores + sello + CTA -->
      <div class="pf-close">
        <ul v-if="data.features" class="pf-features reveal">
          <li v-for="(f, i) in data.features" :key="i" class="pf-feat">
            <span class="pf-feat-icon"><BaseIcon :name="f.icon" :size="20" /></span>
            <div><h3>{{ t(f.title) }}</h3><p>{{ t(f.desc) }}</p></div>
          </li>
        </ul>
        <div class="pf-foot">
          <BaseButton v-if="data.cta" :to="data.cta.to" variant="primary">{{ t(data.cta.label) }}</BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Banda propia: separada de la sección anterior (blanca) y la siguiente (gris)
   con un wash celeste muy sutil + hairlines arriba y abajo. */
.platform { background: linear-gradient(180deg, color-mix(in srgb, var(--celeste) 8%, #fff), color-mix(in srgb, var(--celeste) 3%, #fff)); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }

/* Encabezado centrado y anclado al eje vertical central de la sección: se centra
   en el mismo x que el divisor de los pasos (50% del contenedor) y baja hacia él
   un conector vertical (::after) que se funde con la línea divisoria. */
.pf-head { position: relative; max-width: 62ch; margin: 0 auto; --pf-head-gap: clamp(var(--space-6), 4vw, var(--space-8)); margin-bottom: var(--pf-head-gap); }
.pf-head .lead { margin: var(--space-3) auto 0; }
/* Conector: desde el centro-inferior del encabezado baja hasta el tope del
   divisor de los pasos. Mismo grosor (2px) y color neutro (--line) que el
   divisor inactivo; emerge del texto con un fundido suave. */
.pf-head::after { content: ""; position: absolute; left: 50%; top: 100%; width: 2px; height: var(--pf-head-gap); transform: translateX(-50%); background: linear-gradient(180deg, transparent, var(--line) 45%); pointer-events: none; }

/* Scrollytelling: pasos (texto) a la izquierda, capturas (sticky) a la derecha.
   Columnas simétricas (1fr/1fr) con gap 0 para que el borde entre ambas —y por
   ende el divisor— caiga en el centro horizontal real. El aire entre texto y
   captura se reparte simétrico con padding a cada lado del divisor. */
.pf-scrolly { display: grid; grid-template-columns: 1fr 1fr; gap: 0; align-items: start; }
.pf-scrolly > * { min-width: 0; }
.pf-steps { order: 1; }
.pf-sticky { order: 2; }

/* Ocupa el alto del viewport (bajo el header) y centra el device verticalmente
   mientras los pasos scrollean. */
.pf-sticky { position: sticky; top: var(--header-h); height: calc(100vh - var(--header-h)); display: flex; flex-direction: column; justify-content: center; gap: var(--space-4); padding-left: clamp(var(--space-5), 3vw, var(--space-7)); }
.pf-device { border: 1px solid var(--line); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); background: var(--bg); }
.pf-chrome { display: flex; align-items: center; gap: 6px; padding: 11px 14px; background: var(--bg-alt); border-bottom: 1px solid var(--line); }
.pf-chrome i { width: 10px; height: 10px; border-radius: 50%; background: var(--line); flex: none; }
.pf-chrome i:first-child { background: #e0645a; }
.pf-chrome i:nth-child(2) { background: #e6b23c; }
.pf-chrome i:nth-child(3) { background: #5db15d; }
.pf-url { margin-left: 10px; font: 500 var(--fs-small) var(--font-body); color: var(--muted); background: var(--bg); border: 1px solid var(--line); border-radius: 999px; padding: 3px 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pf-screens { position: relative; aspect-ratio: 1400 / 648; background: var(--bg-alt); }
.pf-screen { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity .45s var(--ease); }
.pf-screen.on { opacity: 1; }

.pf-dots { display: flex; justify-content: center; gap: 7px; }
.pf-dots span { width: 7px; height: 7px; border-radius: 999px; background: var(--line); transition: all var(--dur) var(--ease); }
.pf-dots span.on { width: 22px; background: var(--azul); }

/* Pasos */
.pf-steps { list-style: none; margin: 0; padding: 0; }
/* La línea-acento va en el borde DERECHO de la columna de texto = el centro,
   entre el texto (izq) y la captura (der). */
.pf-step { min-height: 62vh; display: flex; flex-direction: column; justify-content: center; padding: var(--space-6) 0; border-right: 2px solid var(--line); padding-right: clamp(var(--space-5), 3vw, var(--space-7)); opacity: .4; transition: opacity .35s var(--ease), border-color .35s var(--ease); }
.pf-step.is-active { opacity: 1; border-right-color: var(--celeste); }
.pf-step-num { font: 600 var(--fs-small) var(--font-display); color: var(--celeste); letter-spacing: .05em; }
.pf-step-tag { display: inline-block; width: fit-content; margin: var(--space-3) 0 var(--space-2); font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: var(--azul); }
.pf-step h3 { font-size: clamp(1.3rem, 2.2vw, 1.7rem); margin: 0 0 var(--space-3); }
.pf-step p { margin: 0; color: var(--text); font-size: 1.05rem; line-height: 1.6; max-width: 42ch; }

/* Cierre */
.pf-close { margin-top: clamp(var(--space-7), 5vw, var(--space-9)); }
.pf-features { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); }
.pf-feat { display: flex; gap: var(--space-3); align-items: flex-start; background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--space-4) var(--space-5); box-shadow: var(--shadow-xs); transition: box-shadow .2s var(--ease), transform .2s var(--ease), border-color .2s var(--ease); }
.pf-feat:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); border-color: color-mix(in srgb, var(--celeste) 45%, var(--line)); }
.pf-feat-icon { flex: none; display: inline-flex; width: 40px; height: 40px; align-items: center; justify-content: center; border-radius: var(--radius-chip); color: var(--azul); background: linear-gradient(150deg, rgba(58,120,255,.12), rgba(78,167,225,.10)); }
.pf-feat h3 { font-size: .98rem; margin: 0 0 3px; }
.pf-feat p { margin: 0; font-size: .85rem; color: var(--muted); line-height: 1.45; }
.pf-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--space-5); margin-top: clamp(var(--space-6), 4vw, var(--space-7)); padding-top: var(--space-6); border-top: 1px solid var(--line); }

@media (prefers-reduced-motion: reduce) {
  .pf-screen { transition: none; }
}
@media (max-width: 860px) {
  .pf-scrolly { grid-template-columns: 1fr; gap: var(--space-5); }
  /* Sin divisor central en una sola columna: el conector no tiene a qué unirse. */
  .pf-head::after { display: none; }
  /* La imagen queda fija arriba (order -1) y los pasos scrollean debajo */
  .pf-sticky { order: -1; height: auto; justify-content: flex-start; position: sticky; top: var(--header-h); z-index: 1; background: color-mix(in srgb, var(--celeste) 6%, #fff); padding-left: 0; padding-bottom: var(--space-3); }
  .pf-step { min-height: 44vh; border-right: 0; padding-right: 0; margin-right: 0; }
  .pf-features { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .pf-features { grid-template-columns: 1fr; }
  .pf-foot { flex-direction: column; align-items: flex-start; }
}
</style>
