<script setup>
const page = useLegalContent('aviso-legal')
const t = useT()
const { t: $t } = useI18n()

const crumbs = computed(() => [
  { label: $t('nav.home'), to: '/' },
  { label: $t('footer.legalNotice') },
])

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
    <Breadcrumb :items="crumbs" />

    <PageHero
      :eyebrow="page.hero.eyebrow"
      :title="page.hero.title"
      :lead="page.hero.lead"
    />

    <section class="section">
      <div class="container">
        <div class="prose">
          <p class="disclaimer">
            {{ t(page.disclaimer.before) }}
            <a :href="`mailto:${page.disclaimer.email}`">{{ page.disclaimer.email }}</a>{{ t(page.disclaimer.after) }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
