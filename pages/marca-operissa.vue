<script setup>
const page = await useBrandContent('operissa')
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
      icon: s.icon || solutionIcons[i] || 'check',
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

    <!-- 5 · METODOLOGÍA — timeline de fases con nodos, conector y tarjetas -->
    <section class="section method">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.methodology.eyebrow) }}</span>
          <h2>{{ t(page.methodology.title) }}</h2>
        </div>
        <ol class="method-flow reveal">
          <li v-for="(step, i) in page.methodology.steps" :key="i" class="mphase">
            <div class="mphase-head">
              <span class="mphase-node">
                <BaseIcon :name="step.icon || 'check'" :size="26" />
              </span>
            </div>
            <div class="mphase-body">
              <span class="mphase-kicker">
                {{ t(page.methodology.phaseLabel) }} {{ String(step.num).padStart(2, '0') }}
                <span class="mphase-total">/ {{ String(page.methodology.steps.length).padStart(2, '0') }}</span>
              </span>
              <h3>{{ t(step.title) }}</h3>
              <p>{{ t(step.text) }}</p>
            </div>
          </li>
        </ol>
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

/* ── Metodología · timeline de fases ─────────────────────────── */
.method-flow {
  --node: 64px;
  list-style: none;
  margin: var(--space-8) 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

.mphase {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* nodo + conector horizontal entre fases */
.mphase-head {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-5);
}
.mphase-head::before {
  content: "";
  position: absolute;
  top: calc(var(--node) / 2);
  left: 50%;
  width: calc(100% + var(--space-6));
  height: 2px;
  background: var(--line);
  z-index: 0;
}
.mphase:last-child .mphase-head::before { display: none; }

.mphase-node {
  position: relative;
  z-index: 1;
  width: var(--node);
  height: var(--node);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--azul);
  background: color-mix(in srgb, var(--celeste) 10%, var(--bg));
  border: 2px solid color-mix(in srgb, var(--celeste) 32%, var(--line));
  box-shadow: var(--shadow-sm);
  transition: transform var(--ease-out, .25s ease), box-shadow var(--ease-out, .25s ease);
}

/* tarjeta de la fase */
.mphase-body {
  flex: 1;
  text-align: center;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-xs);
  transition: transform var(--ease-out, .25s ease),
              box-shadow var(--ease-out, .25s ease),
              border-color var(--ease-out, .25s ease);
}
.mphase-body:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: color-mix(in srgb, var(--celeste) 40%, var(--line));
}
.mphase:hover .mphase-node {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.mphase-kicker {
  display: block;
  font-family: var(--font-display);
  font-size: var(--fs-kicker);
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--celeste);
  margin-bottom: var(--space-2);
}
.mphase-total { color: var(--muted); font-weight: 500; }

.mphase-body h3 {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  color: var(--ink);
  margin: 0 0 var(--space-2);
}
.mphase-body p {
  font-size: var(--fs-body-sm);
  color: var(--muted);
  margin: 0;
  line-height: 1.5;
}

/* ── Móvil / tablet · stepper vertical con rail lateral ──────── */
@media (max-width: 820px) {
  .method-flow {
    grid-template-columns: 1fr;
    gap: 0;
    max-width: 34rem;
    margin-inline: auto;
  }
  .mphase {
    flex-direction: row;
    align-items: stretch;
    gap: var(--space-4);
    padding-bottom: var(--space-6);
  }
  .mphase:last-child { padding-bottom: 0; }
  .mphase-head {
    flex: 0 0 var(--node);
    margin-bottom: 0;
    display: block;
  }
  .mphase-head::before {
    top: var(--node);
    left: calc(var(--node) / 2);
    width: 2px;
    height: calc(100% - var(--node) + var(--space-6));
    transform: translateX(-50%);
  }
  .mphase-body {
    text-align: left;
    align-self: flex-start;
  }
}
</style>
