<script setup>
const page = useBrandContent('pacifica')
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

// Soluciones normalizadas al contrato de <SolutionsShowcase>
const solutionIcons = ['droplet', 'chart', 'scan', 'cog']
const solutionItems = computed(() =>
  page.solutions.map((s, i) => ({
    icon: solutionIcons[i] || 'check',
    title: s.title,
    desc: s.description,
    // Ocupan fila completa (dos columnas): la insignia (índice 0, checklist largo)
    // y "Operación Integral de Lavanderías" (índice 3). El bento queda simétrico:
    // fila completa / par / fila completa.
    wide: i === 0 || i === 3,
    groups: s.items && s.items.length ? [{ label: s.listLabel, items: s.items }] : [],
  })),
)
</script>

<template>
  <div>
    <!-- 1 · HERO rico (foto enmarcada + badge flotante) -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="kicker">{{ t(page.hero.eyebrow) }}</span>
          <h1 class="display">{{ t(page.hero.claim) }}</h1>
          <p class="lead">{{ t(page.hero.lead) }}</p>
          <div class="hero-actions">
            <BaseButton to="/contacto" variant="primary">{{ $t('cta.evaluation') }}</BaseButton>
            <BaseButton href="#soluciones" variant="ghost">{{ $t('cta.knowMore') }}</BaseButton>
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
              <p class="lead">{{ t(page.whoWeAre.body) }}</p>
            </div>
          </div>
          <div class="hero-media">
            <div class="frame frame--portrait">
              <img :src="page.whoWeAre.image" :alt="t(page.whoWeAre.imageAlt)" width="1000" height="800" loading="lazy" decoding="async">
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

    <!-- 3 · SOLUCIONES (bento: destacada + fila con icono/pill/checklist) -->
    <div id="soluciones">
      <SolutionsShowcase
        :eyebrow="page.solutionsBlock.eyebrow"
        :title="page.solutionsBlock.title"
        :items="solutionItems"
      />
    </div>

    <!-- 4 · SECTORES QUE ATENDEMOS (cards a sangre con overlay) -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.sectorsApplied.eyebrow) }}</span>
          <h2>{{ t(page.sectorsApplied.title) }}</h2>
        </div>
        <div class="grid cols-4 reveal">
          <NuxtLink
            v-for="s in page.sectorsApplied.items"
            :key="s.to"
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

    <!-- 5 · NUESTRA DIFERENCIA — header split título+foto (imagen izq, reverse)
         + key points editoriales CON icono debajo (misma estructura .value-cols). -->
    <section class="section">
      <div class="container">
        <div class="intro-split reverse">
          <div class="intro-copy">
            <div class="section-head left">
              <span class="kicker">{{ t(page.differentiators.eyebrow) }}</span>
              <h2>{{ t(page.differentiators.title) }}</h2>
              <p class="lead">{{ t(page.differentiators.lead) }}</p>
            </div>
          </div>
          <div class="hero-media">
            <div class="frame frame--portrait">
              <img :src="page.differentiators.image" :alt="t(page.differentiators.imageAlt)" width="1000" height="800" loading="lazy" decoding="async">
            </div>
          </div>
        </div>
        <div class="value-cols cols-4 reveal" style="margin-top:var(--space-7)">
          <article v-for="d in page.differentiators.items" :key="d.title.es" class="value-col">
            <span class="v-icon"><BaseIcon :name="d.icon" :size="24" /></span>
            <h3>{{ t(d.title) }}</h3>
            <p>{{ t(d.text) }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- 6 · ECOSISTEMA HIGIENISSA — pipeline de 3 marcas (Pacífica actual). -->
    <EcosystemPipeline
      :eyebrow="page.ecosystem.eyebrow"
      :title="page.ecosystem.title"
      :lead="page.ecosystem.lead"
      current="pacifica"
    />

    <!-- 7 · CTA final -->
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
/* Titulos de cards a 2 lineas balanceadas (misma logica que SolutionsShowcase) */
.h-label span { display: block; }
</style>
