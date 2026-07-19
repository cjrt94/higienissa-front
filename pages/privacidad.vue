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
        <div class="prose legal-prose">
          <template v-for="(sec, i) in page.sections" :key="i">
            <h2>{{ t(sec.heading) }}</h2>
            <p v-for="(par, j) in sec.body" :key="j">{{ t(par) }}</p>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.legal-prose h2 { font-size: var(--fs-h4, 1.25rem); }
.legal-prose h2:first-child { margin-top: 0; }
.legal-prose p { margin-bottom: var(--space-4); color: var(--text); line-height: 1.7; }
</style>
