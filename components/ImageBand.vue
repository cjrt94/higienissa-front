<script setup>
// Banda a sangre con imagen de fondo + overlay + declaración. Reutilizable en todas las plantillas
// para romper la monotonía de grids de texto y dar "momentos visuales" (como la franja ASIS de la home).
const props = defineProps({
  image: { type: String, default: '' }, // opcional: sin imagen → banda sólida en gradiente
  eyebrow: { type: [Object, String], default: '' },
  title: { type: [Object, String], default: '' },
  statement: { type: [Object, String], default: '' },
  ctaTo: { type: String, default: '' },
  ctaLabel: { type: String, default: '' },
  align: { type: String, default: 'center' }, // center | left
})
const t = useT()
</script>

<template>
  <section class="image-band" :class="[`align-${align}`, { 'no-image': !image }]">
    <img v-if="image" :src="image" :alt="t(title) || ''" loading="lazy">
    <div class="ib-overlay" aria-hidden="true" />
    <div class="container ib-inner">
      <span v-if="eyebrow" class="kicker on-dark">{{ t(eyebrow) }}</span>
      <h2 v-if="title">{{ t(title) }}</h2>
      <p v-if="statement" class="ib-statement">{{ t(statement) }}</p>
      <div v-if="ctaTo" class="ib-cta">
        <BaseButton :to="ctaTo" variant="light">{{ ctaLabel || $t('cta.evaluation') }}</BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.image-band { position: relative; padding: clamp(var(--space-8), 9vw, 128px) 0; color: #fff; overflow: hidden; isolation: isolate; }
.image-band img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; }
.ib-overlay { position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(90deg, rgba(15,24,54,.86) 0%, rgba(15,24,54,.66) 55%, rgba(15,24,54,.42) 100%); }
.align-center .ib-overlay { background: linear-gradient(180deg, rgba(15,24,54,.62), rgba(15,24,54,.78)); }
/* Banda sólida (sin foto): gradiente de marca + textura sutil de puntos */
.image-band.no-image { background: linear-gradient(135deg, var(--bg-deep) 0%, #1a2a6b 100%); }
.image-band.no-image .ib-overlay { background:
  radial-gradient(60% 120% at 50% -10%, rgba(78,167,225,.22), transparent 60%),
  radial-gradient(50% 100% at 100% 100%, rgba(58,120,255,.16), transparent 55%); }
.ib-inner { position: relative; max-width: 64ch; }
.align-center .ib-inner { margin: 0 auto; text-align: center; max-width: 56ch; }
.image-band h2 { color: #fff; font-size: clamp(1.7rem, 3vw, 2.6rem); margin-bottom: var(--space-4); }
.ib-statement { font-size: clamp(1.1rem, 1.6vw, 1.35rem); line-height: 1.5; color: rgba(255,255,255,.9); margin: 0; }
.ib-cta { margin-top: var(--space-6); }
</style>
