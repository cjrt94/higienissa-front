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
</script>

<template>
  <section class="page-hero" :class="{ 'with-media': image }">
    <div class="container page-hero-grid">
      <div class="page-hero-copy">
        <span v-if="badge" class="badge">{{ t(badge) }}</span>
        <span v-if="eyebrow" class="kicker">{{ t(eyebrow) }}</span>
        <h1>{{ t(title) }}</h1>
        <p v-if="lead" class="lead">{{ t(lead) }}</p>
        <div v-if="ctaTo" class="hero-actions">
          <BaseButton :to="ctaTo" variant="primary">{{ ctaLabel || $t('cta.evaluation') }}</BaseButton>
        </div>
      </div>
      <div v-if="image" class="page-hero-media">
        <div class="frame"><img :src="image" :alt="t(imageAlt)" width="1000" height="800"></div>
      </div>
    </div>
  </section>
</template>
