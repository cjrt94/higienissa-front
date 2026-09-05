<script setup>
const page = await usePageContent('home')
const t = useT()
const config = useRuntimeConfig()

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'website',
  ogImage: `${config.public.siteUrl}/img/og-higienissa.png`,
})
</script>

<template>
  <div>
    <HeroFlow :data="page.hero" />
    <DivisionsGrid :data="page.divisions" :intro="page.groupIntro" />
    <SectorsGrid :data="page.sectorsBlock" alt />
    <FinalCta :data="page.finalCta" />
  </div>
</template>
