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

    <!-- Hero editorial (título izq / lead + CTA der); las sector-cards de abajo son el payload visual -->
    <section class="page-hero">
      <div class="container">
        <div class="hub-head">
          <div>
            <span class="kicker">{{ t(page.hero.eyebrow) }}</span>
            <h1 class="display">{{ t(page.hero.title) }}</h1>
          </div>
          <div class="hub-head-aside">
            <p class="lead">{{ t(page.hero.lead) }}</p>
            <div class="hero-actions">
              <BaseButton to="/contacto" variant="primary">{{ $t('cta.evaluation') }}</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <SectorsGrid :data="page.sectorsBlock" />

    <FinalCta :data="page.finalCta" />
  </div>
</template>
