<script setup>
const page = await useBrandContent('pacifica')
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
    icon: s.icon || solutionIcons[i] || 'check',
    title: s.title,
    desc: s.description,
    // Ocupa fila completa (dos columnas) la insignia (índice 0, checklist largo).
    // Quedan 3 soluciones (se movió "Operación Integral de Lavanderías" a Operissa):
    // bento = destacada full-width + par debajo.
    wide: i === 0,
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
        <div class="intro-split reverse">
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
      <!-- Puente a Operissa: la operación de lavandería in situ la ejecuta Operissa
           (servicio movido desde Pacífica), con el respaldo del know-how de Pacífica. -->
      <div v-if="page.solutionsBlock.note" class="container">
        <p class="sol-crosslink">
          <span class="scx-icon"><BaseIcon name="cog" :size="18" /></span>
          <span>
            {{ t(page.solutionsBlock.note) }}
            <NuxtLink v-if="page.solutionsBlock.noteTo" class="link-arrow" :to="localePath(page.solutionsBlock.noteTo)">{{ $t('cta.viewMore') }}</NuxtLink>
          </span>
        </p>
      </div>
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

/* Puente discreto a Operissa bajo las soluciones (servicio movido de Pacífica) */
.sol-crosslink {
  display: flex; align-items: flex-start; gap: var(--space-3);
  margin: calc(-1 * var(--space-4)) auto 0; max-width: 760px;
  padding: var(--space-5); border: 1px solid var(--line); border-radius: var(--radius);
  background: var(--bg-alt); color: var(--text); font-size: var(--fs-body-sm); line-height: 1.55;
}
.sol-crosslink .scx-icon { flex: none; width: 38px; height: 38px; border-radius: var(--radius-chip); background: var(--bg); border: 1px solid var(--line); color: var(--azul); display: inline-flex; align-items: center; justify-content: center; }
.sol-crosslink .link-arrow { margin-left: 6px; }
</style>
