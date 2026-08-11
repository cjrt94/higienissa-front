<script setup>
// Hero interno reutilizable. Campos bilingües { es, en }. Imagen opcional.
const props = defineProps({
  eyebrow: { type: [Object, String], default: '' },
  title: { type: [Object, String], default: '' },
  lead: { type: [Object, String], default: '' },
  image: { type: String, default: '' },
  imageAlt: { type: [Object, String], default: '' },
  badge: { type: [Object, String], default: '' },
  ctaTo: { type: String, default: '' },
  ctaLabel: { type: String, default: '' },
})
const t = useT()
const ui = useUiText()

// Entrada del hero: stagger sutil del copy (badge→kicker→h1→lead→CTA). Stagger sobre
// `.anim-in` para tolerar elementos condicionales (badge/eyebrow/CTA opcionales).
const root = ref(null)
useGsapContext(root, ({ gsap }) => {
  gsap.timeline().to('.anim-in', { autoAlpha: 1, y: 0, stagger: 0.12 })
})
</script>

<template>
  <section ref="root" class="page-hero" :class="{ 'with-media': image }">
    <div class="container page-hero-grid">
      <div class="page-hero-copy">
        <span v-if="badge" class="badge anim-in">{{ t(badge) }}</span>
        <span v-if="eyebrow" class="kicker anim-in">{{ t(eyebrow) }}</span>
        <h1 class="anim-in">{{ t(title) }}</h1>
        <p v-if="lead" class="lead anim-in">{{ t(lead) }}</p>
        <div v-if="ctaTo" class="hero-actions anim-in">
          <BaseButton :to="ctaTo" variant="primary">{{ ctaLabel || ui('cta.evaluation') }}</BaseButton>
        </div>
      </div>
      <div v-if="image" class="page-hero-media">
        <div class="frame"><img :src="image" :alt="t(imageAlt)" width="1000" height="800"></div>
      </div>
    </div>
  </section>
</template>
