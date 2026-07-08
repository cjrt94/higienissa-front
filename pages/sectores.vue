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

    <PageHero
      :eyebrow="page.hero.eyebrow"
      :title="page.hero.title"
      :lead="page.hero.lead"
    />

    <SectorsGrid :data="page.sectorsBlock" />

    <FinalCta :data="page.finalCta" />
  </div>
</template>
