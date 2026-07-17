<script setup>
const page = usePageContent('institucional')
const t = useT()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const splitTwo = useSplitTwo()

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'website',
  ogImage: `${config.public.siteUrl}${page.hero.image}`,
})

const capIcons = ['droplet', 'scan', 'chart', 'shield', 'activity', 'cog']
const diffIcons = ['users', 'shield', 'activity', 'scan']
</script>

<template>
  <div>
    <Breadcrumb
      :items="[
        { label: $t('nav.home'), to: '/' },
        { label: $t('nav.about') },
      ]"
    />

    <!-- 1 · HERO rico (foto + badge) -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="kicker">{{ t(page.hero.eyebrow) }}</span>
          <h1 class="display">{{ t(page.hero.title) }}</h1>
          <p class="lead">{{ t(page.hero.lead) }}</p>
          <div class="hero-actions">
            <BaseButton to="/contacto" variant="primary">{{ $t('cta.evaluation') }}</BaseButton>
            <BaseButton href="#ecosistema" variant="ghost">{{ $t('cta.knowMore') }}</BaseButton>
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

    <!-- 2 · QUIÉNES SOMOS (split con foto + highlights) -->
    <section class="section section-alt">
      <div class="container">
        <div class="intro-split">
          <div class="intro-copy">
            <div class="section-head left">
              <span class="kicker">{{ t(page.whoWeAre.eyebrow) }}</span>
              <h2>{{ t(page.whoWeAre.title) }}</h2>
              <p class="lead">{{ t(page.whoWeAre.lead) }}</p>
            </div>
          </div>
          <div class="hero-media">
            <div class="frame" style="aspect-ratio:4/3.2;box-shadow:var(--shadow-md)">
              <img :src="page.whoWeAre.image" :alt="t(page.whoWeAre.imageAlt)" width="1000" height="800" loading="lazy">
            </div>
          </div>
        </div>
        <div class="grid cols-3 reveal" style="margin-top:var(--space-7)">
          <div v-for="h in page.whoWeAre.highlights" :key="h.label.es" class="highlight">
            <span class="h-icon"><BaseIcon :name="h.icon" :size="22" /></span>
            <span>
              <span class="h-label"><span v-for="(ln, i) in splitTwo(h.label)" :key="i">{{ ln }}</span></span>
              <p>{{ t(h.text) }}</p>
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 3 · TESIS DEL ECOSISTEMA (banda a sangre + cards de división) -->
    <ImageBand
      :image="page.ecosystem.image"
      :eyebrow="page.ecosystem.eyebrow"
      :title="page.ecosystem.title"
      :statement="page.ecosystem.lead"
      align="center"
    />
    <section id="ecosistema" class="section">
      <div class="container">
        <p class="eco-mother mx-auto"><strong>{{ t(page.ecosystem.mother.name) }}</strong> — {{ t(page.ecosystem.mother.desc) }}</p>
        <div class="grid cols-3 reveal">
          <article v-for="node in page.ecosystem.nodes" :key="node.brand" class="card">
            <div class="card-media">
              <img :src="node.image" :alt="t(node.imageAlt)" width="800" height="500" loading="lazy">
            </div>
            <div class="card-body">
              <h3>{{ t(node.name) }}</h3>
              <p class="card-desc">{{ t(node.desc) }}</p>
              <NuxtLink class="link-arrow" :to="localePath(node.to)">{{ $t('cta.know') }} {{ node.brand }}</NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 4 · QUÉ INTEGRAMOS / CAPACIDADES (feature cards con icono) -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.capabilities.eyebrow) }}</span>
          <h2>{{ t(page.capabilities.title) }}</h2>
          <p class="lead mx-auto">{{ t(page.capabilities.lead) }}</p>
        </div>
        <div class="feature-grid cols-3 reveal">
          <div v-for="(cap, i) in page.capabilities.items" :key="i" class="feature">
            <span class="feature-icon"><BaseIcon :name="capIcons[i] || 'check'" /></span>
            <h3><span v-for="(ln, j) in splitTwo(cap.title)" :key="j">{{ ln }}</span></h3>
            <p>{{ t(cap.desc) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5 · METODOLOGÍA (pasos numerados) -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.methodology.eyebrow) }}</span>
          <h2>{{ t(page.methodology.title) }}</h2>
          <p class="lead mx-auto">{{ t(page.methodology.lead) }}</p>
        </div>
        <ul class="steps cols-4 reveal">
          <li v-for="(step, i) in page.methodology.steps" :key="i" class="step">
            <span class="step-num">{{ step.num }}</span>
            <h3>{{ t(step.title) }}</h3>
            <p>{{ t(step.text) }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- 6 · DIFERENCIADORES (pilares con icono) -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.differentiators.eyebrow) }}</span>
          <h2>{{ t(page.differentiators.title) }}</h2>
        </div>
        <div class="pillars cols-4 reveal">
          <div v-for="(d, i) in page.differentiators.items" :key="i" class="pillar">
            <span class="pillar-icon"><BaseIcon :name="diffIcons[i] || 'check'" /></span>
            <h3><span v-for="(ln, j) in splitTwo(d.title)" :key="j">{{ ln }}</span></h3>
            <p>{{ t(d.text) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 7 · SECTORES TRANSVERSALES (cards a sangre) -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.sectorsBlock.eyebrow) }}</span>
          <h2>{{ t(page.sectorsBlock.title) }}</h2>
          <p class="lead mx-auto">{{ t(page.sectorsBlock.lead) }}</p>
        </div>
        <div class="grid cols-4 reveal">
          <NuxtLink
            v-for="(s, i) in page.sectorsBlock.items"
            :key="i"
            class="sector-card"
            :to="localePath(s.to)"
          >
            <img :src="s.image" :alt="t(s.imageAlt)" width="600" height="800" loading="lazy">
            <span class="sc-body">
              <h3>{{ t(s.name) }}</h3>
              <p>{{ t(s.desc) }}</p>
              <span class="sc-link">{{ $t('cta.seeSector') }}</span>
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 8 · RESPALDO ASIS -->
    <AsisStrip :data="page.asis" />

    <!-- 9 · CTA final -->
    <section class="section cta-band bg-motion">
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

<style scoped>
.h-label span, .feature h3 span, .pillar h3 span { display: block; }
.eco-mother { max-width: 60ch; text-align: center; color: var(--muted); margin: 0 0 var(--space-7); }
.eco-mother strong { color: var(--ink); }
</style>
