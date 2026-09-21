<script setup>
// Hero — Flujo tipográfico (centrado): kicker + titular con palabra clave en degradado +
// lead + CTAs. La fila de nodos de marca que cerraba el hero se retiró (pedido del
// cliente, 2026-09-21): las marcas viven en "Tres marcas, una misma visión" justo debajo.
const props = defineProps({ data: { type: Object, required: true } })
const t = useT()
const ui = useUiText()

// Entrada del hero: timeline sutil kicker→título→lead→CTA.
const root = ref(null)
useGsapContext(root, ({ gsap }) => {
  gsap.timeline()
    .to('.flow-kicker', { autoAlpha: 1, y: 0 })
    .fromTo('.flow-title', { scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1 }, '-=0.40')
    .to('.flow-lead', { autoAlpha: 1, y: 0 }, '-=0.45')
    .to('.flow-actions', { autoAlpha: 1, y: 0 }, '-=0.45')
})

const hlTitle = computed(() =>
  t(props.data.title)
    .replace(/\n/g, '<br>')
    .replace(/(ecosistema|ecosystem)/i, '<span class="hl">$1</span>'),
)
</script>

<template>
  <section ref="root" class="hero-flow">
    <div class="flow-aura" aria-hidden="true" />
    <div class="container flow-inner">
      <span class="kicker flow-kicker anim-in">{{ t(data.eyebrow) }}</span>
      <h1 class="flow-title anim-in" v-html="hlTitle" />
      <p class="flow-lead anim-in">{{ t(data.lead) }}</p>
      <div class="flow-actions anim-in">
        <BaseButton to="/contacto" variant="primary">{{ ui('cta.evaluation') }}</BaseButton>
        <a class="flow-link" href="#ecosistema">{{ ui('cta.knowEcosystem') }} →</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* margin-top negativo: el hero sube por detrás del navbar (sticky, 72px) para que
   éste sea realmente transparente y deje ver el fondo del hero, no el blanco de la banda. */
.hero-flow { position: relative; overflow: hidden; margin-top: calc(-1 * var(--header-h)); padding: calc(var(--header-h) + clamp(20px, 4vh, 56px)) 0 clamp(40px, 7vh, 80px); background: var(--bg); isolation: isolate; }
.flow-aura { position: absolute; inset: 0; z-index: -1; background:
  radial-gradient(52% 60% at 50% 0%, rgba(78,167,225,.18), transparent 64%),
  radial-gradient(40% 50% at 8% 96%, rgba(28,42,135,.08), transparent 60%); }

.flow-inner { text-align: center; }
.flow-kicker { display: inline-block; margin-bottom: var(--space-4); color: var(--celeste); }
.flow-title { font: 600 clamp(2rem, 4.4vw, 3.5rem)/1.04 var(--font-display); letter-spacing: -.02em; color: var(--ink); margin: 0 auto var(--space-5); max-width: 20ch; }
.flow-title :deep(.hl) { background: linear-gradient(100deg, var(--azul) 0%, var(--celeste) 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.flow-lead { font-size: var(--fs-lead); line-height: 1.55; color: var(--text); max-width: 58ch; margin: 0 auto var(--space-6); }
.flow-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--space-4); }
.flow-link { font: 600 var(--fs-body) var(--font-body); color: var(--azul); }
.flow-link:hover { color: var(--electrico); }
</style>
