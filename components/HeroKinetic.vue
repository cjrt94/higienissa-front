<script setup>
// Hero — Kinético: el titular rota el sector servido (salud → hotelería → industria → minería)
// con swap animado. Las 3 marcas quedan como trío estático y finito (con ícono).
const props = defineProps({ data: { type: Object, required: true } })
const t = useT()
const settings = useSettings()
const { locale } = useI18n()
const L = (es, en) => (locale.value === 'en' ? en : es)

const PHRASES = {
  es: ['Cumplimiento a escala industrial.', 'Trazabilidad de cada activo.', 'Operación que no se detiene.', 'Un estándar en todo el ciclo.'],
  en: ['Compliance at industrial scale.', 'Traceability for every asset.', 'Operations that never stop.', 'One standard across the cycle.'],
}
const idx = ref(0)
let timer
onMounted(() => { timer = setInterval(() => { idx.value = (idx.value + 1) % PHRASES.es.length }, 2600) })
onBeforeUnmount(() => clearInterval(timer))
const phrase = computed(() => (PHRASES[locale.value] || PHRASES.es)[idx.value])

const ICON = { pacifica: 'droplet', trazatex: 'scan', operissa: 'cog' }
const brands = computed(() =>
  settings.ecosystem.pipeline.map((n) => ({ ...n, icon: ICON[n.slug] || 'check' })),
)
</script>

<template>
  <section class="hero-kin">
    <div class="kin-aura" aria-hidden="true" />
    <div class="container kin-inner">
      <span class="kicker kin-kicker">{{ t(data.eyebrow) }}</span>

      <h1 class="kin-title">
        <span class="kin-static">{{ L('Un solo ecosistema.', 'One ecosystem.') }}</span>
        <span class="kin-rot">
          <Transition name="kin" mode="out-in">
            <span :key="idx" class="kin-word">{{ phrase }}</span>
          </Transition>
        </span>
      </h1>

      <p class="kin-lead">{{ t(data.lead) }}</p>

      <div class="kin-actions">
        <BaseButton to="/contacto" variant="primary">{{ $t('cta.evaluation') }}</BaseButton>
        <a class="kin-link" href="#ecosistema">{{ $t('cta.knowEcosystem') }} →</a>
      </div>

      <ul class="kin-brands">
        <li v-for="b in brands" :key="b.slug">
          <span class="kb-icon"><BaseIcon :name="b.icon" :size="18" /></span>
          <span class="kb-name">{{ b.name }}</span>
          <span class="kb-role">{{ t(b.role) }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* sube por detrás del navbar transparente (igual que flow) */
.hero-kin { position: relative; overflow: hidden; isolation: isolate; background: var(--bg);
  margin-top: calc(-1 * var(--header-h));
  padding: calc(var(--header-h) + clamp(28px, 6vh, 72px)) 0 clamp(40px, 7vh, 80px); }
.kin-aura { position: absolute; inset: 0; z-index: -1; background:
  radial-gradient(52% 58% at 50% 0%, rgba(78,167,225,.16), transparent 64%),
  radial-gradient(38% 48% at 10% 96%, rgba(28,42,135,.07), transparent 60%); }

.kin-inner { text-align: center; }
.kin-kicker { display: inline-block; margin-bottom: var(--space-4); color: var(--celeste); }

.kin-title { font: 600 clamp(2.1rem, 4.8vw, 3.7rem)/1.06 var(--font-display); letter-spacing: -.02em; color: var(--ink); margin: 0 auto var(--space-5); max-width: 24ch; }
.kin-static { display: block; }
.kin-rot { display: flex; align-items: center; justify-content: center; min-height: 1.3em; margin-top: -4px; }
.kin-word { display: inline-block; font-size: clamp(1.4rem, 3vw, 2.45rem); line-height: 1.15; background: linear-gradient(100deg, var(--azul) 0%, var(--celeste) 55%, var(--electrico) 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.kin-enter-active, .kin-leave-active { transition: opacity .34s ease, transform .34s ease; }
.kin-enter-from { opacity: 0; transform: translateY(.55em); }
.kin-leave-to { opacity: 0; transform: translateY(-.55em); }
/* reduce-motion: sigue rotando el contenido pero sin desplazamiento (swap instantáneo) */
@media (prefers-reduced-motion: reduce) {
  .kin-enter-active, .kin-leave-active { transition: none; }
  .kin-enter-from, .kin-leave-to { transform: none; }
}

.kin-lead { font-size: clamp(1rem, 1.25vw, 1.15rem); line-height: 1.55; color: var(--text); max-width: 58ch; margin: 0 auto var(--space-6); }
.kin-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--space-4); }
.kin-link { font: 600 var(--fs-body) var(--font-body); color: var(--azul); }
.kin-link:hover { color: var(--electrico); }

/* Trío estático y finito de marcas */
.kin-brands { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-3) var(--space-5); list-style: none; margin: clamp(36px, 6vh, 64px) 0 0; padding: 0; }
.kin-brands li { display: inline-flex; align-items: center; gap: 10px; padding: 8px 16px 8px 8px; border: 1px solid var(--line); border-radius: 999px; background: #fff; }
.kb-icon { display: inline-flex; width: 30px; height: 30px; align-items: center; justify-content: center; border-radius: 50%; color: #fff; background: linear-gradient(135deg, var(--azul) 0%, color-mix(in srgb, var(--celeste) 72%, var(--azul)) 100%); flex: none; }
.kb-name { font: 600 var(--fs-body) var(--font-display); color: var(--ink); }
.kb-role { font: 600 var(--fs-small) var(--font-body); color: var(--celeste); text-transform: uppercase; letter-spacing: .06em; }

@media (max-width: 560px) {
  .kin-brands li { padding: 7px 14px 7px 7px; }
}
</style>
