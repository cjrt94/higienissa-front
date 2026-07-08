<script setup>
const page = useSectorContent('salud')
const t = useT()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'website',
})

// roles como filas ricas (StakeList espera { icon, title, desc })
const roleItems = computed(() =>
  page.impactByRole.items.map((r) => ({ icon: r.icon, title: r.role, desc: r.desc })),
)
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

    <!-- 1 · HERO (foto derecha + badge) -->
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
          <div class="hero-badge">
            <span class="hb-icon"><BaseIcon name="scan" :size="22" /></span>
            <span><b>{{ t(page.hero.badge.title) }}</b><span>{{ t(page.hero.badge.sub) }}</span></span>
          </div>
        </div>
      </div>
    </section>

    <!-- 2 · CONTEXTO (split INVERTIDO: foto izquierda + checklist ciego) -->
    <section class="section section-alt">
      <div class="container">
        <div class="intro-split reverse">
          <div class="intro-copy">
            <div class="section-head left">
              <span class="kicker">{{ t(page.context.kicker) }}</span>
              <h2>{{ t(page.context.title) }}</h2>
              <p class="lead">{{ t(page.context.lead) }}</p>
            </div>
            <p class="context-unknowns-label">{{ t(page.context.unknownsLabel) }}</p>
            <ul class="marker-list ask reveal" style="gap:var(--space-4)">
              <li v-for="(item, i) in page.context.unknowns" :key="i">{{ t(item) }}</li>
            </ul>
          </div>
          <div class="hero-media">
            <div class="frame" style="aspect-ratio:4/3;box-shadow:var(--shadow-md)">
              <img :src="page.context.image" :alt="t(page.context.imageAlt)" width="1200" height="900" loading="lazy">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3 · RIESGOS (risk ledger: head sticky + filas) -->
    <section class="section">
      <div class="container split-sticky">
        <div class="sticky-head">
          <div class="section-head">
            <span class="kicker">{{ t(page.risks.kicker) }}</span>
            <h2>{{ t(page.risks.title) }}</h2>
            <p class="lead">{{ t(page.risks.lead) }}</p>
          </div>
        </div>
        <div class="risk-groups">
          <div v-for="(g, gi) in page.risks.groups" :key="gi" class="risk-group">
            <span class="risk-group-label">{{ t(g.label) }}</span>
            <StakeList :items="g.items" marker="risk" />
          </div>
        </div>
      </div>
    </section>

    <!-- 4 · BANDA (declaración-bisagra problema→solución, sin foto) -->
    <ImageBand
      :eyebrow="page.band.eyebrow"
      :title="page.band.title"
      :statement="page.band.statement"
      align="center"
    />

    <!-- 5 · QUÉ CAMBIA (comparativa de → a) -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.whatChanges.kicker) }}</span>
          <h2>{{ t(page.whatChanges.title) }}</h2>
          <p class="lead mx-auto">{{ t(page.whatChanges.lead) }}</p>
        </div>
        <FromTo
          :from="page.whatChanges.from"
          :to="{ label: page.whatChanges.toLabel, items: page.whatChanges.items }"
        />
      </div>
    </section>

    <!-- 6 · LO QUE PASA A SER MEDIBLE (panel de medición) -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.indicators.kicker) }}</span>
          <h2>{{ t(page.indicators.title) }}</h2>
        </div>
        <MeasureBoard
          :kicker="page.indicators.kicker"
          :source="page.indicators.source"
          :items="page.indicators.items"
        />
      </div>
    </section>

    <!-- 7 · IMPACTO POR ROL (split foto derecha + roles como filas jerárquicas) -->
    <section class="section section-alt">
      <div class="container">
        <div class="intro-split">
          <div class="intro-copy">
            <div class="section-head left">
              <span class="kicker">{{ t(page.impactByRole.kicker) }}</span>
              <h2>{{ t(page.impactByRole.title) }}</h2>
            </div>
            <StakeList :items="roleItems" marker="icon" />
          </div>
          <div class="hero-media">
            <div class="frame" style="aspect-ratio:4/3.6;box-shadow:var(--shadow-md)">
              <img :src="page.impactByRole.image" :alt="t(page.impactByRole.imageAlt)" width="1000" height="900" loading="lazy">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8 · MARCAS (firma del ecosistema) -->
    <section id="marcas" class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.brands.kicker) }}</span>
          <h2>{{ t(page.brands.title) }}</h2>
          <p class="lead mx-auto">{{ t(page.brands.lead) }}</p>
        </div>
        <div class="grid cols-3 reveal">
          <article v-for="item in page.brands.items" :key="item.name" class="card">
            <div class="card-media">
              <img :src="item.image" :alt="t(item.imageAlt)" width="800" height="500" loading="lazy">
            </div>
            <div class="card-body">
              <span class="card-eyebrow">{{ t(item.eyebrow) }}</span>
              <h3>{{ item.name }}</h3>
              <p class="card-role">{{ t(item.role) }}</p>
              <p class="card-desc">{{ t(item.desc) }}</p>
              <NuxtLink class="link-arrow" :to="localePath(item.to)">{{ t(item.cta) }}</NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <FinalCta :data="page.finalCta" />
  </div>
</template>

<style scoped>
.context-unknowns-label { font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin: var(--space-6) 0 var(--space-3); }

/* Riesgos agrupados por dimensión (jerarquía) */
.risk-groups { display: flex; flex-direction: column; gap: var(--space-6); }
.risk-group-label { display: inline-block; font: 700 var(--fs-small) var(--font-body); letter-spacing: .04em; color: var(--azul); background: var(--bg-alt); border: 1px solid var(--line); border-radius: 999px; padding: 4px 14px; margin-bottom: var(--space-2); }

/* Rol de marca (jerarquía en las cards de marca) */
.card-role { margin: 0 0 var(--space-1); font-weight: 700; color: var(--ink); font-size: 1rem; }
</style>
