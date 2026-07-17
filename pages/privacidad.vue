<script setup>
const page = useLegalContent('privacidad')
const t = useT()

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'website',
})
</script>

<template>
  <div>
    <PageHero
      :eyebrow="page.hero.eyebrow"
      :title="page.hero.title"
      :lead="page.hero.lead"
    />

    <section class="section">
      <div class="container">
        <div class="prose">
          <p class="disclaimer">
            {{ t(page.disclaimerLead) }}<a :href="`mailto:${page.contactEmail}`">{{ page.contactEmail }}</a>.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
