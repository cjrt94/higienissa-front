<script setup>
const page = useBrandContent('operissa')
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
        { label: page.name },
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

    <!-- Quiénes somos -->
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
              <div>
                <span class="h-label">{{ t(h.label) }}</span>
                <p>{{ t(h.text) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Soluciones -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.solutions.eyebrow) }}</span>
          <h2>{{ t(page.solutions.title) }}</h2>
        </div>
        <div class="grid cols-2">
          <article v-for="(sol, i) in page.solutions.items" :key="i" class="card">
            <div class="card-body">
              <h3>{{ t(sol.title) }}</h3>
              <p class="card-desc">{{ t(sol.desc) }}</p>
              <template v-for="(g, gi) in sol.groups" :key="gi">
                <span class="card-eyebrow" style="margin-top:var(--space-3)">{{ t(g.label) }}</span>
                <ul class="marker-list more">
                  <li v-for="(it, ii) in g.items" :key="ii">{{ t(it) }}</li>
                </ul>
              </template>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Metodología -->
    <section id="metodologia" class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.methodology.eyebrow) }}</span>
          <h2>{{ t(page.methodology.title) }}</h2>
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

    <!-- Sectores que atendemos -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.sectors.eyebrow) }}</span>
          <h2>{{ t(page.sectors.title) }}</h2>
        </div>
        <div class="grid cols-4">
          <NuxtLink v-for="(s, i) in page.sectors.items" :key="i" class="card" :to="localePath(s.to)">
            <div class="card-body">
              <h3>{{ t(s.name) }}</h3>
              <p class="card-desc">{{ t(s.desc) }}</p>
              <span class="link-arrow">{{ $t('cta.seeSector') }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Ecosistema Higienissa -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.ecosystem.eyebrow) }}</span>
          <h2>{{ t(page.ecosystem.title) }}</h2>
          <p class="lead">{{ t(page.ecosystem.lead) }}</p>
        </div>
        <div class="grid cols-2">
          <article v-for="(b, i) in page.ecosystem.items" :key="i" class="card">
            <div class="card-media">
              <img :src="b.image" :alt="t(b.imageAlt)" width="800" height="500" loading="lazy">
            </div>
            <div class="card-body">
              <h3>{{ b.name }}</h3>
              <p class="card-desc">{{ t(b.desc) }}</p>
              <NuxtLink class="link-arrow" :to="localePath(b.to)">
                {{ $t('cta.know') }} {{ b.name }}
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <FinalCta :data="page.finalCta" />
  </div>
</template>
