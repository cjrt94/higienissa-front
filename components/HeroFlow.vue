<script setup>
// Hero — Flujo tipográfico (centrado): titular con palabra clave en degradado +
// el flujo del ecosistema (Procesa → Traza → Opera) con riel central animado.
const props = defineProps({ data: { type: Object, required: true } })
const t = useT()
const settings = await useSettings()
const { locale } = useI18n()
const hlTitle = computed(() =>
  t(props.data.title)
    .replace(/\n/g, '<br>')
    .replace(/(ecosistema|ecosystem)/i, '<span class="hl">$1</span>'),
)
// Ícono representativo por empresa + descripciones locales de largo homogéneo.
const ICON = { pacifica: 'droplet', trazatex: 'scan', operissa: 'cog' }
const DESC = {
  pacifica: { es: '<strong>Lavandería</strong> industrial inteligente: el origen de la disponibilidad del textil.', en: 'Smart industrial <strong>laundry</strong>: the origin of textile availability at scale.' },
  trazatex: { es: 'RFID, software y data para el control individual de cada activo textil.', en: 'RFID, software and data for individual control of every textile asset.' },
  operissa: { es: 'Operación textil especializada en terreno para que nada se detenga.', en: 'Specialized on-site textile operation so your service never stops.' },
}
// Nodo extra SOLO del hero (no se agrega al pipeline compartido de settings.json,
// que alimenta EcosystemPipeline en otras páginas): el grupo cierra el flujo y garantiza el ciclo.
const EXTRA = {
  name: 'Grupo Higienissa',
  role: { es: 'Garantiza', en: 'Guarantees' },
  icon: 'shield',
  blurb: { es: 'El estándar único que integra proceso, trazabilidad y operación.', en: 'The single standard that integrates process, traceability and operation.' },
}
const nodes = computed(() => [
  ...settings.ecosystem.pipeline.map((n) => ({
    key: n.slug,
    name: n.name,
    role: n.role,
    icon: ICON[n.slug] || 'check',
    blurb: DESC[n.slug]?.[locale.value] || t(n.desc),
  })),
  { key: 'grupo', name: EXTRA.name, role: EXTRA.role, icon: EXTRA.icon, blurb: EXTRA.blurb[locale.value] },
])
</script>

<template>
  <section class="hero-flow">
    <div class="flow-aura" aria-hidden="true" />
    <div class="container flow-inner">
      <span class="kicker flow-kicker">{{ t(data.eyebrow) }}</span>
      <h1 class="flow-title" v-html="hlTitle" />
      <p class="flow-lead">{{ t(data.lead) }}</p>
      <div class="flow-actions">
        <BaseButton to="/contacto" variant="primary">{{ $t('cta.evaluation') }}</BaseButton>
        <a class="flow-link" href="#ecosistema">{{ $t('cta.knowEcosystem') }} →</a>
      </div>

      <div class="flow-track">
        <span class="flow-rail" aria-hidden="true"><i /></span>
        <ol class="flow-nodes">
          <li v-for="n in nodes" :key="n.key" class="flow-node" :class="{ 'is-group': n.key === 'grupo' }">
            <span class="fn-mark"><BaseIcon :name="n.icon" :size="n.key === 'grupo' ? 24 : 20" /></span>
            <span class="fn-name">{{ n.name }}</span>
            <span class="fn-role">{{ t(n.role) }}</span>
            <span class="fn-desc" v-html="n.blurb" />
          </li>
        </ol>
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

/* Flujo de 3 nodos con riel central animado */
.flow-track { position: relative; max-width: 1120px; margin: clamp(40px, 6vh, 72px) auto 0; }
.flow-rail { position: absolute; top: 20px; left: calc(100% / 8); right: calc(100% / 8); height: 2px; background: var(--line); border-radius: 2px; overflow: hidden; }
.flow-rail i { position: absolute; inset: 0 auto 0 0; width: 34%; background: linear-gradient(90deg, transparent, var(--celeste), transparent); animation: flow-run 3s linear infinite; }
@keyframes flow-run { from { transform: translateX(-100%); } to { transform: translateX(400%); } }
@media (prefers-reduced-motion: reduce) { .flow-rail i { animation: none; width: 100%; opacity: .45; } }

.flow-nodes { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-5); list-style: none; margin: 0; padding: 0; }
.flow-node { display: flex; flex-direction: column; align-items: center; text-align: center; }
.fn-mark { position: relative; z-index: 1; display: inline-flex; width: 40px; height: 40px; align-items: center; justify-content: center; border-radius: 50%; color: #fff; background: linear-gradient(135deg, var(--azul) 0%, color-mix(in srgb, var(--celeste) 72%, var(--azul)) 100%); box-shadow: 0 4px 14px color-mix(in srgb, var(--azul) 22%, transparent); margin-bottom: var(--space-4); }
.fn-name { font: 600 1.35rem/1.1 var(--font-display); color: var(--ink); }
.fn-role { font: 600 var(--fs-body-sm) var(--font-body); color: var(--celeste); margin: 3px 0 var(--space-3); }
.fn-desc { font-size: var(--fs-body-sm); line-height: 1.5; color: var(--muted); max-width: 30ch; }
.fn-desc :deep(strong) { font-weight: 700; color: var(--ink); }

/* Nodo de cierre: Grupo Higienissa se destaca como ancla/culminación del flujo
   (el que engloba y garantiza), sin salirse del sistema (paleta azul, sin bordes). */
.flow-node.is-group .fn-mark {
  width: 52px; height: 52px; margin-top: -6px; margin-bottom: calc(var(--space-4) - 6px);
  background: var(--azul);
  box-shadow: 0 0 0 7px color-mix(in srgb, var(--celeste) 16%, transparent),
              0 8px 22px color-mix(in srgb, var(--azul) 28%, transparent);
}
.flow-node.is-group .fn-name {
  background: linear-gradient(100deg, var(--azul) 0%, var(--celeste) 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

@media (max-width: 720px) {
  .flow-nodes { grid-template-columns: 1fr; gap: var(--space-6); }
  .flow-rail { display: none; }
}
</style>
