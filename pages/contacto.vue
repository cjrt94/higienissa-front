<script setup>
const page = usePageContent('contacto')
const t = useT()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
})
</script>

<template>
  <div>
    <Breadcrumb :items="[{ label: $t('nav.home'), to: '/' }, { label: $t('nav.contact') }]" />
    <PageHero :eyebrow="page.hero.eyebrow" :title="page.hero.title" :lead="page.hero.lead" />
    <section class="section" style="padding-top:0">
      <div class="container">
        <ContactForm />
      </div>
    </section>
  </div>
</template>
