<script setup>
const page = useBrandContent('operissa')
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

// Soluciones normalizadas al contrato de <SolutionsShowcase> (con groups)
// Orden + layout del bento de soluciones (pedido del cliente):
//   fila 1: Laundry | Housekeeping · fila 2: Ropería (fila completa) · fila 3: Outsourcing | Logistics
const solutionIcons = ['cog', 'shield', 'menu', 'users', 'activity']
const solutionOrder = [0, 2, 1, 3, 4] // reordena a: Laundry, Housekeeping, Ropería, Outsourcing, Logistics
const solutionItems = computed(() =>
  solutionOrder.map((src, i) => {
    const s = page.solutions.items[src]
    return {
      icon: solutionIcons[i] || 'check',
      title: s.title,
      desc: s.desc,
      groups: (s.groups || []).map((g) => ({ label: g.label, items: g.items })),
      wide: i === 2, // Ropería ocupa la fila completa
    }
  }),
)
</script>

<template>
  <div>
    <!-- 1 · HERO rico (foto + badge flotante) -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="kicker">{{ t(page.hero.eyebrow) }}</span>
          <h1 class="display">{{ t(page.hero.title) }}</h1>
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
              <p class="lead">{{ t(page.whoWeAre.lead) }}</p>
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

    <!-- 3 · SOLUCIONES (bento) -->
    <div id="soluciones">
      <SolutionsShowcase
        :eyebrow="page.solutions.eyebrow"
        :title="page.solutions.title"
        :items="solutionItems"
      />
    </div>

    <!-- 4 · SECTORES QUE ATENDEMOS (cards a sangre) -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.sectors.eyebrow) }}</span>
          <h2>{{ t(page.sectors.title) }}</h2>
        </div>
        <div class="grid cols-4 reveal">
          <NuxtLink
            v-for="s in page.sectors.items"
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

    <!-- 5 · METODOLOGÍA -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.methodology.eyebrow) }}</span>
          <h2>{{ t(page.methodology.title) }}</h2>
        </div>
        <ul class="steps cols-4 reveal">
          <li v-for="(step, i) in page.methodology.steps" :key="i" class="step">
            <span class="step-num">{{ String(step.num).padStart(2, '0') }}</span>
            <h3>{{ t(step.title) }}</h3>
            <p>{{ t(step.text) }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- 6 · ECOSISTEMA HIGIENISSA — pipeline de 3 marcas (Operissa actual). -->
    <EcosystemPipeline
      :eyebrow="page.ecosystem.eyebrow"
      :title="page.ecosystem.title"
      :lead="page.ecosystem.lead"
      current="operissa"
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
.h-label span { display: block; }
</style>
