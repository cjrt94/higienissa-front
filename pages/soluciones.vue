<script setup>
const page = usePageContent('soluciones')
const t = useT()
const config = useRuntimeConfig()
const localePath = useLocalePath()

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
  { label: 'Trazatex', to: '/marca-trazatex' },
  { label: t({ es: 'Soluciones', en: 'Solutions' }) },
])
</script>

<template>
  <div>
    <Breadcrumb :items="crumbs" />

    <PageHero
      :eyebrow="page.hero.eyebrow"
      :title="page.hero.title"
      :lead="page.hero.lead"
      :image="page.hero.image"
      :image-alt="page.hero.imageAlt"
      cta-to="/contacto"
      :cta-label="$t('cta.diagnosis')"
    />

    <!-- El problema -->
    <section class="section section-alt">
      <div class="container intro-split">
        <div class="intro-copy">
          <div class="section-head">
            <span class="kicker">{{ t(page.problem.kicker) }}</span>
            <h2>{{ t(page.problem.title) }}</h2>
            <p class="lead">{{ t(page.problem.lead) }}</p>
          </div>
        </div>
        <ul class="marker-list ask" :aria-label="t(page.problem.ariaLabel)">
          <li v-for="(item, i) in page.problem.items" :key="i">{{ t(item) }}</li>
        </ul>
      </div>
    </section>

    <!-- Detalle de la solución -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.solutionDetail.kicker) }}</span>
          <h2>{{ t(page.solutionDetail.title) }}</h2>
          <p class="lead">{{ t(page.solutionDetail.lead) }}</p>
        </div>
        <h3>{{ t(page.solutionDetail.includesTitle) }}</h3>
        <ul class="marker-list gain cols-2" :aria-label="t(page.solutionDetail.includesTitle)">
          <li v-for="(item, i) in page.solutionDetail.items" :key="i">{{ t(item) }}</li>
        </ul>
      </div>
    </section>

    <!-- Cómo funciona: las 4 capas -->
    <section id="proceso" class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.layers.kicker) }}</span>
          <h2>{{ t(page.layers.title) }}</h2>
          <p class="lead">{{ t(page.layers.lead) }}</p>
        </div>
        <div class="feature-grid cols-2">
          <article v-for="(layer, i) in page.layers.items" :key="i" class="feature">
            <span class="feature-kicker">{{ t(layer.step) }}</span>
            <h3>{{ t(layer.title) }}</h3>
            <p>{{ t(layer.text) }}</p>
            <ul v-if="layer.points && layer.points.length">
              <li v-for="(pt, j) in layer.points" :key="j">{{ t(pt) }}</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- Indicadores -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.indicators.kicker) }}</span>
          <h2>{{ t(page.indicators.title) }}</h2>
        </div>
        <div class="grid cols-3">
          <article v-for="(ind, i) in page.indicators.items" :key="i" class="card">
            <div class="card-body">
              <h3>{{ t(ind.title) }}</h3>
              <p class="card-desc">{{ t(ind.desc) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Sectores que atendemos -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.sectorsBlock.kicker) }}</span>
          <h2>{{ t(page.sectorsBlock.title) }}</h2>
        </div>
        <div class="grid cols-3">
          <NuxtLink
            v-for="(sec, i) in page.sectorsBlock.items"
            :key="i"
            class="card"
            :to="localePath(sec.to)"
          >
            <div class="card-body">
              <h3>{{ t(sec.name) }}</h3>
              <p class="card-desc">{{ t(sec.desc) }}</p>
              <span class="link-arrow">{{ $t('cta.seeSector') }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Ecosistema -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.ecosystem.kicker) }}</span>
          <h2>{{ t(page.ecosystem.title) }}</h2>
          <p class="lead">{{ t(page.ecosystem.lead) }}</p>
        </div>
        <div class="grid cols-2">
          <article v-for="(item, i) in page.ecosystem.items" :key="i" class="card">
            <div class="card-media">
              <img :src="item.image" :alt="t(item.imageAlt)" width="800" height="600" loading="lazy">
            </div>
            <div class="card-body">
              <h3>{{ t(item.title) }}</h3>
              <p class="card-desc">{{ t(item.desc) }}</p>
              <NuxtLink class="link-arrow" :to="localePath(item.to)">{{ t(item.cta) }}</NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA final: Solicitar diagnóstico -->
    <section class="section cta-band">
      <div class="container">
        <h2>{{ t(page.finalCta.title) }}</h2>
        <p class="lead">{{ t(page.finalCta.lead) }}</p>
        <div class="cta-actions">
          <BaseButton to="/contacto" variant="light">{{ $t('cta.diagnosis') }}</BaseButton>
        </div>
      </div>
    </section>
  </div>
</template>
