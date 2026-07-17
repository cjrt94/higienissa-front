<script setup>
const page = useSectorContent('hoteleria')
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
  { label: t({ es: 'Sectores', en: 'Sectors' }), to: '/sectores' },
  { label: t(page.name) },
])
</script>

<template>
  <div>
    <Breadcrumb :items="crumbs" />

    <!-- 1 · HERO rico (foto + badge) -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="kicker">{{ t(page.hero.eyebrow) }}</span>
          <h1 class="display">{{ t(page.hero.title) }}</h1>
          <p class="lead">{{ t(page.hero.lead) }}</p>
          <div class="hero-actions">
            <BaseButton to="/contacto" variant="primary">{{ $t('cta.evaluation') }}</BaseButton>
            <BaseButton href="#marcas" variant="ghost">{{ $t('cta.knowMore') }}</BaseButton>
          </div>
        </div>
        <div class="hero-media">
          <div class="frame">
            <img :src="page.hero.image" :alt="t(page.hero.imageAlt)" width="1200" height="1020">
          </div>
          <div v-if="page.hero.badge" class="hero-badge">
            <span class="hb-icon"><BaseIcon :name="page.hero.badge.icon" :size="22" /></span>
            <span><b>{{ t(page.hero.badge.title) }}</b><span>{{ t(page.hero.badge.sub) }}</span></span>
          </div>
        </div>
      </div>
    </section>

    <!-- 2 · CONTEXTO (split foto + costo oculto) -->
    <section class="section section-alt">
      <div class="container">
        <div class="intro-split reverse">
          <div class="intro-copy">
            <div class="section-head left">
              <span class="kicker">{{ t(page.context.kicker) }}</span>
              <h2>{{ t(page.context.title) }}</h2>
              <p class="lead">{{ t(page.context.lead) }}</p>
            </div>
            <p class="ctx-label">{{ t(page.context.hiddenCostLabel) }}</p>
            <ul class="marker-list ask reveal" style="gap:var(--space-4)">
              <li v-for="(it, i) in page.context.hiddenCost" :key="i">{{ t(it) }}</li>
            </ul>
          </div>
          <div class="hero-media">
            <div class="frame" style="aspect-ratio:4/3.4;box-shadow:var(--shadow-md)">
              <img :src="page.context.image" :alt="t(page.context.imageAlt)" width="1000" height="850" loading="lazy">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3 · RIESGOS OPERATIVOS -->
    <section class="section">
      <div class="container">
        <div class="section-head left">
          <span class="kicker">{{ t(page.risks.kicker) }}</span>
          <h2>{{ t(page.risks.title) }}</h2>
          <p class="lead">{{ t(page.risks.lead) }}</p>
        </div>
        <ul class="marker-list risk cols-2 reveal" :aria-label="t(page.risks.title)">
          <li v-for="(it, i) in page.risks.items" :key="i">{{ t(it) }}</li>
        </ul>
      </div>
    </section>

    <!-- 4 · QUÉ CAMBIA — banda a sangre con foto + lista de ganancias -->
    <ImageBand
      :image="page.whatChanges.image"
      :eyebrow="page.whatChanges.kicker"
      :title="page.whatChanges.title"
      :statement="page.whatChanges.lead"
      align="center"
    />
    <section class="section">
      <div class="container">
        <ul class="marker-list gain cols-2 reveal" :aria-label="t(page.whatChanges.title)">
          <li v-for="(it, i) in page.whatChanges.items" :key="i">{{ t(it) }}</li>
        </ul>
      </div>
    </section>

    <!-- 5 · INDICADORES GESTIONABLES -->
    <section class="section section-alt">
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

    <!-- 6 · IMPACTO POR ROL -->
    <section class="section">
      <div class="container">
        <div class="section-head left">
          <span class="kicker">{{ t(page.impactByRole.kicker) }}</span>
          <h2>{{ t(page.impactByRole.title) }}</h2>
        </div>
        <div class="grid cols-3 reveal">
          <article v-for="(role, i) in page.impactByRole.items" :key="i" class="card">
            <div class="card-body">
              <h3>{{ t(role.role) }}</h3>
              <p class="card-desc">{{ t(role.desc) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 7 · MARCAS RELEVANTES -->
    <section id="marcas" class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.brands.kicker) }}</span>
          <h2>{{ t(page.brands.title) }}</h2>
          <p class="lead mx-auto">{{ t(page.brands.lead) }}</p>
        </div>
        <div class="grid cols-3 reveal">
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

<style scoped>
.ctx-label { font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin: var(--space-6) 0 var(--space-3); }
</style>
