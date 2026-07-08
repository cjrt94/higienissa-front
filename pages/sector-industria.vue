<script setup>
const page = useSectorContent('industria')
const t = useT()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'website',
})

const crumbs = computed(() => [
  { label: t({ es: 'Inicio', en: 'Home' }), to: '/' },
  { label: t({ es: 'Sectores', en: 'Sectors' }), to: '/sectores' },
  { label: t(page.name) },
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
      :cta-label="$t('cta.evaluation')"
    />

    <!-- El contexto / desafío real -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.context.eyebrow) }}</span>
          <h2>{{ t(page.context.title) }}</h2>
          <p class="lead">{{ t(page.context.lead) }}</p>
        </div>
        <div class="pillars cols-3">
          <div v-for="(p, i) in page.context.pillars" :key="i" class="pillar">
            <span class="pillar-icon"><BaseIcon :name="p.icon" :size="26" /></span>
            <h3>{{ t(p.title) }}</h3>
            <p>{{ t(p.text) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Riesgos operativos -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.risks.eyebrow) }}</span>
          <h2>{{ t(page.risks.title) }}</h2>
        </div>
        <ul class="marker-list risk cols-2" :aria-label="t(page.risks.title)">
          <li v-for="(r, i) in page.risks.items" :key="i">{{ t(r) }}</li>
        </ul>
      </div>
    </section>

    <!-- Qué cambia con la solución del grupo -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.whatChanges.eyebrow) }}</span>
          <h2>{{ t(page.whatChanges.title) }}</h2>
          <p class="lead">{{ t(page.whatChanges.lead) }}</p>
        </div>
        <ul class="marker-list gain cols-2" :aria-label="t(page.whatChanges.title)">
          <li v-for="(w, i) in page.whatChanges.items" :key="i">{{ t(w) }}</li>
        </ul>
      </div>
    </section>

    <!-- Indicadores gestionables -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.indicators.eyebrow) }}</span>
          <h2>{{ t(page.indicators.title) }}</h2>
        </div>
        <div class="chips" :aria-label="t(page.indicators.title)">
          <span v-for="(ind, i) in page.indicators.items" :key="i" class="chip">{{ t(ind) }}</span>
        </div>
      </div>
    </section>

    <!-- Impacto por rol -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.impactByRole.eyebrow) }}</span>
          <h2>{{ t(page.impactByRole.title) }}</h2>
        </div>
        <div class="grid cols-3">
          <article v-for="(role, i) in page.impactByRole.items" :key="i" class="card">
            <div class="card-body">
              <h3>{{ t(role.title) }}</h3>
              <p class="card-desc">{{ t(role.text) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Marcas relevantes para Industria -->
    <section id="marcas" class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.brands.eyebrow) }}</span>
          <h2>{{ t(page.brands.title) }}</h2>
          <p class="lead">{{ t(page.brands.lead) }}</p>
        </div>
        <div class="grid cols-3">
          <article v-for="(b, i) in page.brands.items" :key="i" class="card">
            <div class="card-media">
              <img :src="b.image" :alt="t(b.imageAlt)" width="600" height="375" loading="lazy">
            </div>
            <div class="card-body">
              <h3>{{ t(b.name) }}</h3>
              <p class="card-desc">{{ t(b.desc) }}</p>
              <NuxtLink class="link-arrow" :to="localePath(b.to)">{{ t(b.linkLabel) }}</NuxtLink>
            </div>
          </article>
        </div>
        <p class="disclaimer">{{ t(page.brands.note) }}</p>
      </div>
    </section>

    <FinalCta :data="page.finalCta" />
  </div>
</template>
