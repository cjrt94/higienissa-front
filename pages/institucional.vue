<script setup>
const page = await usePageContent('institucional')
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

const diffIcons = ['users', 'shield', 'activity', 'scan']
const capIcons = ['droplet', 'scan', 'chart', 'shield', 'activity', 'users', 'cog']
</script>

<template>
  <div>
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

    <!-- 3 · ECOSISTEMA HIGIENISSA — mismo pipeline de las páginas de marca.
         Al ser la página del grupo, no hay nodo "actual" (current=""): las tres
         marcas se muestran por igual, todas enlazadas. alt=false para separarse
         del "Quiénes somos" (gris) de arriba y de "Qué integramos" (gris) de abajo. -->
    <EcosystemPipeline
      :eyebrow="page.ecosystem.eyebrow"
      :title="page.ecosystem.title"
      :lead="page.ecosystem.lead"
      :alt="false"
      current=""
    />

    <!-- 4 · QUÉ INTEGRAMOS — split editorial: encabezado + dato ancla (izq, sticky) y
         las capacidades como lista con divisores (der). Comunica el valor ("una sola
         interlocución") y admite cualquier número de ítems sin dejar huecos. Neutro. -->
    <section class="section section-alt">
      <div class="container">
        <div class="integrate-grid">
          <div class="integrate-head">
            <span class="kicker">{{ t(page.capabilities.eyebrow) }}</span>
            <h2>{{ t(page.capabilities.title) }}</h2>
            <p class="lead">{{ t(page.capabilities.lead) }}</p>
            <div class="integrate-metric">
              <span class="im-num">{{ page.capabilities.items.length }}</span>
              <span class="im-text">{{ t(page.capabilities.metric) }}</span>
            </div>
          </div>
          <ul class="integrate-list reveal">
            <li v-for="(cap, i) in page.capabilities.items" :key="i" class="integrate-item">
              <span class="ii-icon"><BaseIcon :name="capIcons[i] || 'check'" :size="20" /></span>
              <div class="ii-body">
                <h3>{{ t(cap.title) }}</h3>
                <p>{{ t(cap.desc) }}</p>
              </div>
            </li>
          </ul>
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
            <span class="step-num">{{ String(step.num).padStart(2, '0') }}</span>
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
        <div class="value-cols cols-4 reveal">
          <article v-for="(d, i) in page.differentiators.items" :key="i" class="value-col">
            <span class="v-icon"><BaseIcon :name="diffIcons[i] || 'check'" :size="24" /></span>
            <h3>{{ t(d.title) }}</h3>
            <p>{{ t(d.text) }}</p>
          </article>
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
.h-label span { display: block; }

/* Qué integramos — split editorial (neutro, sin azul ni gradiente):
   encabezado + dato ancla a la izquierda; capacidades como lista a la derecha. */
.integrate-grid { display: grid; grid-template-columns: 0.82fr 1.18fr; gap: clamp(var(--space-7), 6vw, var(--space-9)); align-items: start; }
.integrate-head { position: sticky; top: calc(var(--header-h) + var(--space-5)); }
.integrate-head h2 { margin: 0; }
.integrate-head .lead { margin: var(--space-4) 0 0; max-width: 38ch; }
.integrate-metric { display: flex; align-items: center; gap: var(--space-4); margin-top: var(--space-6); padding-top: var(--space-6); border-top: 1px solid var(--line); }
.im-num { flex: none; font: 600 clamp(2.6rem, 4vw, 3.4rem)/1 var(--font-display); color: var(--azul); letter-spacing: -0.02em; }
.im-text { color: var(--text); font-size: var(--fs-body-sm); line-height: 1.5; max-width: 26ch; }

.integrate-list { list-style: none; margin: 0; padding: 0; }
.integrate-item { display: flex; gap: var(--space-4); align-items: flex-start; padding: var(--space-5) 0; border-top: 1px solid var(--line); }
.integrate-item:first-child { border-top: 0; padding-top: 0; }
.ii-icon { flex: none; display: inline-flex; width: 44px; height: 44px; align-items: center; justify-content: center; border-radius: 12px; background: var(--bg); border: 1px solid var(--line); color: var(--azul); }
.ii-body h3 { font-size: 1.15rem; margin: 0 0 4px; }
.ii-body p { margin: 0; color: var(--muted); font-size: var(--fs-body-sm); line-height: 1.55; }

@media (max-width: 900px) {
  .integrate-grid { grid-template-columns: 1fr; gap: var(--space-6); }
  .integrate-head { position: static; }
}
</style>
