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
  ogImage: `${config.public.siteUrl}${page.hero.image}`,
})
</script>

<template>
  <div>
    <HeroFlow :data="page.hero" />
    <GroupIntro :data="page.groupIntro" />
    <DivisionsGrid :data="page.divisions" />
    <PillarsGrid :data="page.pillars" />
    <SectorsGrid :data="page.sectorsBlock" />
    <FinalCta :data="page.finalCta" />
  </div>
</template>
