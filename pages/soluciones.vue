<script setup>
const page = usePageContent('soluciones')
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

const indIcons = ['chart', 'target', 'droplet', 'activity', 'scan', 'shield']
const pad = (n) => String(n).padStart(2, '0')
</script>

<template>
  <div>
    <Breadcrumb
      :items="[
        { label: $t('nav.home'), to: '/' },
        { label: $t('nav.solutions'), to: '/marca-trazatex' },
        { label: t(page.hero.title) },
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
            <BaseButton to="/contacto" variant="primary">{{ $t('cta.diagnosis') }}</BaseButton>
            <BaseButton href="#capas" variant="ghost">{{ $t('cta.knowMore') }}</BaseButton>
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

    <!-- 2 · EL PROBLEMA (split-sticky: encuadre + evidencia) -->
    <section class="section">
      <div class="container split-sticky">
        <div class="sticky-head">
          <div class="section-head">
            <span class="kicker">{{ t(page.problem.kicker) }}</span>
            <h2>{{ t(page.problem.title) }}</h2>
            <p class="lead">{{ t(page.problem.lead) }}</p>
          </div>
        </div>
        <div class="problem-symptoms reveal">
          <span class="mini-label">{{ t(page.problem.ariaLabel) }}</span>
          <StakeList :items="page.problem.items" marker="number" />
        </div>
      </div>
    </section>

    <!-- 3 · DETALLE DE LA SOLUCIÓN (split con foto + Incluye) -->
    <section class="section section-alt">
      <div class="container">
        <div class="intro-split">
          <div class="intro-copy">
            <div class="section-head left">
              <span class="kicker">{{ t(page.solutionDetail.kicker) }}</span>
              <h2>{{ t(page.solutionDetail.title) }}</h2>
              <p class="lead">{{ t(page.solutionDetail.lead) }}</p>
            </div>
          </div>
          <div class="hero-media">
            <div class="frame" style="aspect-ratio:4/3.2;box-shadow:var(--shadow-md)">
              <img :src="page.solutionDetail.image" :alt="t(page.solutionDetail.imageAlt)" width="1000" height="800" loading="lazy">
            </div>
          </div>
        </div>
        <div class="sd-includes reveal">
          <span class="mini-label">{{ t(page.solutionDetail.includesTitle) }}</span>
          <ul class="check-cols">
            <li v-for="(it, i) in page.solutionDetail.items" :key="i">{{ t(it) }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 4 · CÓMO FUNCIONA: 4 CAPAS (cards numeradas con puntos) -->
    <section id="capas" class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.layers.kicker) }}</span>
          <h2>{{ t(page.layers.title) }}</h2>
          <p class="lead mx-auto">{{ t(page.layers.lead) }}</p>
        </div>
        <div class="grid cols-2 reveal">
          <div v-for="(l, i) in page.layers.items" :key="i" class="layer-card">
            <span class="layer-num">{{ pad(i + 1) }}</span>
            <h3>{{ t(l.title) }}</h3>
            <p>{{ t(l.text) }}</p>
            <ul v-if="l.points && l.points.length" class="check-list">
              <li v-for="(pt, j) in l.points" :key="j">{{ t(pt) }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 5 · INDICADORES (cards con icono) -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.indicators.kicker) }}</span>
          <h2>{{ t(page.indicators.title) }}</h2>
        </div>
        <div class="grid cols-3 reveal">
          <article v-for="(it, i) in page.indicators.items" :key="i" class="data-card">
            <span class="feature-icon"><BaseIcon :name="indIcons[i] || 'chart'" :size="22" /></span>
            <h3>{{ t(it.title) }}</h3>
            <p>{{ t(it.desc) }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- 6 · SECTORES (cards a sangre) -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.sectorsBlock.kicker) }}</span>
          <h2>{{ t(page.sectorsBlock.title) }}</h2>
        </div>
        <div class="grid cols-3 reveal">
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

    <!-- 7 · ECOSISTEMA (banda + cards) -->
    <ImageBand
      :image="page.ecosystem.image"
      :eyebrow="page.ecosystem.kicker"
      :title="page.ecosystem.title"
      :statement="page.ecosystem.lead"
      align="center"
    />
    <section class="section section-alt">
      <div class="container">
        <div class="grid cols-2 reveal">
          <article v-for="(b, i) in page.ecosystem.items" :key="i" class="card">
            <div class="card-media">
              <img :src="b.image" :alt="t(b.imageAlt)" width="800" height="500" loading="lazy">
            </div>
            <div class="card-body">
              <h3>{{ t(b.title) }}</h3>
              <p class="card-desc">{{ t(b.desc) }}</p>
              <NuxtLink class="link-arrow" :to="localePath(b.to)">{{ t(b.cta) }}</NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 8 · CTA final -->
    <section class="section cta-band bg-motion">
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

<style scoped>
.mini-label { display: block; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: var(--space-4); }

/* Problema — numeros celeste serif en la lista de evidencia */
.problem-symptoms :deep(.marker-number .stake-marker) { background: transparent; border: 0; width: 2.2rem; height: auto; color: var(--celeste); font: 400 1.5rem/1 var(--font-display); margin-top: 0; justify-content: flex-start; }

/* Detalle — checklist a 2 columnas */
.sd-includes { margin-top: var(--space-7); }
.check-cols { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3) var(--space-6); }
.check-cols li { position: relative; padding-left: 28px; margin: 0; color: var(--text); }
.check-cols li::before { content: "\2713"; position: absolute; left: 0; top: 0; width: 20px; height: 1.6em; display: inline-flex; align-items: center; justify-content: center; font: 700 13px/1 var(--font-body); color: var(--azul); }
@media (max-width: 760px) { .check-cols { grid-template-columns: 1fr; } }

/* 4 capas — cards numeradas (celeste serif) con puntos */
.layer-card { background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--space-6); box-shadow: var(--shadow-xs); transition: box-shadow .2s var(--ease), transform .2s var(--ease); }
.layer-card:hover { box-shadow: var(--shadow-sm); transform: translateY(-3px); }
.layer-num { display: block; font: 400 2.4rem/1 var(--font-display); color: var(--celeste); margin-bottom: var(--space-3); }
.layer-card h3 { font-size: 1.2rem; margin-bottom: var(--space-2); }
.layer-card p { margin: 0; color: var(--text); }
.layer-card .check-list { margin-top: var(--space-4); }
.check-list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2); grid-template-columns: 1fr 1fr; }
.check-list li { position: relative; padding-left: 24px; margin: 0; font-size: .92rem; line-height: 1.5; color: var(--text); }
.check-list li::before { content: "\2713"; position: absolute; left: 0; top: 0; width: 18px; height: 1.5em; display: inline-flex; align-items: center; justify-content: center; font: 700 12px/1 var(--font-body); color: var(--azul); }

/* Indicadores — cards con tile de icono */
.data-card { background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--space-6); box-shadow: var(--shadow-xs); transition: box-shadow .2s var(--ease), transform .2s var(--ease), border-color .2s var(--ease); }
.data-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); border-color: color-mix(in srgb, var(--celeste) 45%, var(--line)); }
.data-card h3 { font-size: 1.1rem; margin: var(--space-2) 0; }
.data-card p { margin: 0; color: var(--text); font-size: .92rem; line-height: 1.5; }

@media (max-width: 600px) { .layer-card .check-list { grid-template-columns: 1fr; } }
</style>
