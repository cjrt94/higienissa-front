<script setup>
const page = useSectorContent('hoteleria')
const t = useT()
const localePath = useLocalePath()

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
    <Breadcrumb
      :items="[
        { label: $t('nav.home'), to: '/' },
        { label: $t('nav.sectors'), to: '/sectores' },
        { label: t(page.name) },
      ]"
    />

    <PageHero
      :eyebrow="page.hero.eyebrow"
      :title="page.hero.title"
      :lead="page.hero.lead"
      :image="page.hero.image"
      :image-alt="page.hero.imageAlt"
      cta-to="/contacto"
      :cta-label="$t('cta.evaluation')"
    />

    <!-- El contexto / desafío real -->
    <section class="section section-alt">
      <div class="container intro-split">
        <div class="intro-copy">
          <div class="section-head left">
            <span class="kicker">{{ t(page.context.kicker) }}</span>
            <h2>{{ t(page.context.title) }}</h2>
            <p class="lead">{{ t(page.context.lead) }}</p>
          </div>
        </div>
        <ul class="marker-list ask" :aria-label="t(page.context.hiddenCostLabel)">
          <li v-for="(it, i) in page.context.hiddenCost" :key="i">{{ t(it) }}</li>
        </ul>
      </div>
    </section>

    <!-- Riesgos operativos -->
    <section class="section">
      <div class="container">
        <div class="section-head left">
          <span class="kicker">{{ t(page.risks.kicker) }}</span>
          <h2>{{ t(page.risks.title) }}</h2>
          <p class="lead">{{ t(page.risks.lead) }}</p>
        </div>
        <ul class="marker-list risk cols-2" :aria-label="t(page.risks.title)">
          <li v-for="(it, i) in page.risks.items" :key="i">{{ t(it) }}</li>
        </ul>
      </div>
    </section>

    <!-- Qué cambia con la solución del grupo -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head left">
          <span class="kicker">{{ t(page.whatChanges.kicker) }}</span>
          <h2>{{ t(page.whatChanges.title) }}</h2>
          <p class="lead">{{ t(page.whatChanges.lead) }}</p>
        </div>
        <ul class="marker-list gain cols-2" :aria-label="t(page.whatChanges.title)">
          <li v-for="(it, i) in page.whatChanges.items" :key="i">{{ t(it) }}</li>
        </ul>
      </div>
    </section>

    <!-- Indicadores gestionables -->
    <section class="section">
      <div class="container">
        <div class="section-head left">
          <span class="kicker">{{ t(page.indicators.kicker) }}</span>
          <h2>{{ t(page.indicators.title) }}</h2>
        </div>
        <ul class="chips" :aria-label="t(page.indicators.title)">
          <li v-for="(it, i) in page.indicators.items" :key="i" class="chip">{{ t(it) }}</li>
        </ul>
      </div>
    </section>

    <!-- Impacto por rol -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head left">
          <span class="kicker">{{ t(page.impactByRole.kicker) }}</span>
          <h2>{{ t(page.impactByRole.title) }}</h2>
        </div>
        <div class="grid cols-3">
          <article v-for="(role, i) in page.impactByRole.items" :key="i" class="card">
            <div class="card-body">
              <h3>{{ t(role.role) }}</h3>
              <p class="card-desc">{{ t(role.desc) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Marcas relevantes para Hotelería -->
    <section id="marcas" class="section">
      <div class="container">
        <div class="section-head left">
          <span class="kicker">{{ t(page.brands.kicker) }}</span>
          <h2>{{ t(page.brands.title) }}</h2>
          <p class="lead">{{ t(page.brands.lead) }}</p>
        </div>
        <div class="grid cols-3">
          <article v-for="(brand, i) in page.brands.items" :key="i" class="card">
            <div class="card-media">
              <img :src="brand.image" :alt="t(brand.imageAlt)" width="800" height="500" loading="lazy">
            </div>
            <div class="card-body">
              <h3>{{ brand.name }}</h3>
              <p class="card-desc">{{ t(brand.desc) }}</p>
              <NuxtLink :to="localePath(brand.to)" class="link-arrow">{{ t(brand.linkLabel) }}</NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <FinalCta :data="page.finalCta" />
  </div>
</template>
