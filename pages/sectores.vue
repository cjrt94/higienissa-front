<script setup>
const page = usePageContent('sectores')
const t = useT()
const config = useRuntimeConfig()

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'website',
  ogImage: `${config.public.siteUrl}/img/ecosistema.jpg`,
})
</script>

<template>
  <div>
    <Breadcrumb :items="[{ label: $t('nav.home'), to: '/' }, { label: $t('nav.sectors') }]" />

    <!-- Hero centrado (las sector-cards de abajo son el payload visual) -->
    <section class="hero">
      <div class="container hub-hero">
        <span class="kicker">{{ t(page.hero.eyebrow) }}</span>
        <h1 class="display">{{ t(page.hero.title) }}</h1>
        <p class="lead mx-auto">{{ t(page.hero.lead) }}</p>
        <div class="hero-actions" style="justify-content:center">
          <BaseButton to="/contacto" variant="primary">{{ $t('cta.evaluation') }}</BaseButton>
        </div>
      </div>
    </section>

    <SectorsGrid :data="page.sectorsBlock" />

    <FinalCta :data="page.finalCta" />
  </div>
</template>

<style scoped>
.hub-hero { max-width: 780px; margin: 0 auto; text-align: center; }
.hub-hero .lead { margin: 0 auto var(--space-6); }
</style>
