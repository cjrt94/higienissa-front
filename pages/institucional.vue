<script setup>
const page = usePageContent('institucional')
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
        { label: $t('nav.about') },
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

    <!-- Quiénes somos / propósito -->
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
          <div class="highlight-stack" :aria-label="t(page.whoWeAre.title)">
            <div v-for="(h, i) in page.whoWeAre.highlights" :key="i" class="highlight">
              <span class="h-icon"><BaseIcon :name="h.icon" :size="22" /></span>
              <span>
                <span class="h-label">{{ t(h.label) }}</span>
                <p>{{ t(h.text) }}</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- La tesis del ecosistema -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.ecosystem.eyebrow) }}</span>
          <h2>{{ t(page.ecosystem.title) }}</h2>
          <p class="lead">{{ t(page.ecosystem.lead) }}</p>
        </div>
        <div class="highlight" style="margin-bottom:var(--space-5)">
          <span class="h-label">{{ t(page.ecosystem.mother.name) }}</span>
          <p>{{ t(page.ecosystem.mother.desc) }}</p>
        </div>
        <div class="grid cols-3">
          <article v-for="(node, i) in page.ecosystem.nodes" :key="i" class="card">
            <div class="card-body">
              <h3>{{ t(node.name) }}</h3>
              <p class="card-desc">{{ t(node.desc) }}</p>
              <NuxtLink class="link-arrow" :to="localePath(node.to)">
                {{ $t('cta.know') }} {{ node.brand }}
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Qué integramos / capacidades -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.capabilities.eyebrow) }}</span>
          <h2>{{ t(page.capabilities.title) }}</h2>
          <p class="lead">{{ t(page.capabilities.lead) }}</p>
        </div>
        <div class="grid cols-3">
          <article v-for="(cap, i) in page.capabilities.items" :key="i" class="card">
            <div class="card-body">
              <h3>{{ t(cap.title) }}</h3>
              <p class="card-desc">{{ t(cap.desc) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Metodología -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.methodology.eyebrow) }}</span>
          <h2>{{ t(page.methodology.title) }}</h2>
          <p class="lead">{{ t(page.methodology.lead) }}</p>
        </div>
        <ul class="steps cols-4">
          <li v-for="(step, i) in page.methodology.steps" :key="i" class="step">
            <span class="step-num">{{ step.num }}</span>
            <h3>{{ t(step.title) }}</h3>
            <p>{{ t(step.text) }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Diferenciadores -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.differentiators.eyebrow) }}</span>
          <h2>{{ t(page.differentiators.title) }}</h2>
        </div>
        <div class="pillars cols-4">
          <div v-for="(d, i) in page.differentiators.items" :key="i" class="pillar">
            <h3>{{ t(d.title) }}</h3>
            <p>{{ t(d.text) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sectores transversales -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.sectorsBlock.eyebrow) }}</span>
          <h2>{{ t(page.sectorsBlock.title) }}</h2>
          <p class="lead">{{ t(page.sectorsBlock.lead) }}</p>
        </div>
        <div class="grid cols-4">
          <NuxtLink v-for="(s, i) in page.sectorsBlock.items" :key="i" class="card" :to="localePath(s.to)">
            <div class="card-body">
              <h3>{{ t(s.name) }}</h3>
              <p class="card-desc">{{ t(s.desc) }}</p>
              <span class="link-arrow">{{ $t('cta.seeSector') }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Respaldo tecnológico ASIS -->
    <AsisStrip :data="page.asis" />

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
