<script setup>
const page = useBrandContent('pacifica')
const t = useT()
const localePath = useLocalePath()
const config = useRuntimeConfig()

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'website',
  ogImage: `${config.public.siteUrl}${page.hero.image}`,
})

const crumbs = computed(() => [
  { label: t({ es: 'Inicio', en: 'Home' }), to: '/' },
  { label: page.name },
])
</script>

<template>
  <div>
    <Breadcrumb :items="crumbs" />

    <PageHero
      :eyebrow="page.hero.eyebrow"
      :title="page.hero.claim"
      :lead="page.hero.lead"
      :image="page.hero.image"
      :image-alt="page.hero.imageAlt"
      cta-to="/contacto"
      :cta-label="$t('cta.evaluation')"
    />

    <!-- Quiénes somos -->
    <section class="section section-alt">
      <div class="container intro-split">
        <div class="intro-copy">
          <div class="section-head">
            <span class="kicker">{{ t(page.whoWeAre.eyebrow) }}</span>
            <h2>{{ t(page.whoWeAre.title) }}</h2>
            <p class="lead">{{ t(page.whoWeAre.body) }}</p>
          </div>
        </div>
        <div class="highlight-stack">
          <div v-for="h in page.whoWeAre.highlights" :key="h.label.es" class="highlight">
            <span class="h-icon"><BaseIcon :name="h.icon" /></span>
            <div>
              <span class="h-label">{{ t(h.label) }}</span>
              <p>{{ t(h.text) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Soluciones -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.solutionsBlock.eyebrow) }}</span>
          <h2>{{ t(page.solutionsBlock.title) }}</h2>
        </div>
        <div class="grid cols-2">
          <article v-for="sol in page.solutions" :key="sol.order" class="card">
            <div class="card-body">
              <span v-if="sol.executedBy" class="card-eyebrow">{{ t(sol.executedBy.label) }}</span>
              <h3>{{ t(sol.title) }}</h3>
              <p class="card-desc">{{ t(sol.description) }}</p>
              <span class="card-eyebrow">{{ t(sol.listLabel) }}</span>
              <ul class="chips">
                <li v-for="(it, i) in sol.items" :key="i" class="chip">{{ t(it) }}</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Sectores que atendemos -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.sectorsApplied.eyebrow) }}</span>
          <h2>{{ t(page.sectorsApplied.title) }}</h2>
        </div>
        <div class="grid cols-4">
          <NuxtLink
            v-for="s in page.sectorsApplied.items"
            :key="s.to"
            class="card"
            :to="localePath(s.to)"
          >
            <div class="card-body">
              <h3>{{ t(s.name) }}</h3>
              <p class="card-desc">{{ t(s.desc) }}</p>
              <span class="link-arrow">{{ $t('cta.seeSector') }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Nuestra diferencia -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.differentiators.eyebrow) }}</span>
          <h2>{{ t(page.differentiators.title) }}</h2>
        </div>
        <div class="pillars cols-4">
          <div v-for="d in page.differentiators.items" :key="d.title.es" class="pillar">
            <span class="pillar-icon"><BaseIcon :name="d.icon" /></span>
            <h3>{{ t(d.title) }}</h3>
            <p>{{ t(d.text) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Ecosistema HIGIENISSA -->
    <section id="ecosistema" class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.ecosystem.eyebrow) }}</span>
          <h2>{{ t(page.ecosystem.title) }}</h2>
          <p class="lead">{{ t(page.ecosystem.lead) }}</p>
        </div>
        <div class="grid cols-2">
          <article v-for="b in page.ecosystem.items" :key="b.name" class="card">
            <div class="card-media">
              <img :src="b.image" :alt="t(b.imageAlt)" width="800" height="500" loading="lazy">
            </div>
            <div class="card-body">
              <h3>{{ b.name }}</h3>
              <p class="card-desc">{{ t(b.desc) }}</p>
              <NuxtLink class="link-arrow" :to="localePath(b.to)">{{ t(b.cta) }}</NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="section cta-band">
      <div class="container">
        <h2>{{ t(page.finalCta.title) }}</h2>
        <p class="lead">{{ t(page.finalCta.lead) }}</p>
        <div class="cta-actions">
          <BaseButton to="/contacto" variant="light">{{ $t('cta.evaluation') }}</BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>
