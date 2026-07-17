<script setup>
const page = useBrandContent('trazatex')
const t = useT()
const config = useRuntimeConfig()
const localePath = useLocalePath()
const splitTwo = useSplitTwo()

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'website',
  ogImage: `${config.public.siteUrl}${page.hero.image}`,
})

const breadcrumb = computed(() => [
  { label: t({ es: 'Inicio', en: 'Home' }), to: '/' },
  { label: page.name },
])

// Soluciones al contrato de <SolutionsShowcase> (sin groups: solo titulo + desc)
const solutionIcons = ['scan', 'chart', 'shield', 'target', 'activity', 'cog']
const solutionItems = computed(() =>
  page.solutions.items.map((s, i) => ({
    icon: solutionIcons[i] || 'check',
    title: s.title,
    desc: s.desc,
    groups: [],
  })),
)

const techIcons = ['cog', 'chart', 'users']
const infoIcons = ['chart', 'activity', 'droplet', 'target', 'scan', 'cog', 'chart', 'activity']
</script>

<template>
  <div>
    <Breadcrumb :items="breadcrumb" />

    <!-- 1 · HERO rico (foto + badge ASIS flotante que enlaza al respaldo) -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="kicker">{{ t(page.hero.eyebrow) }}</span>
          <h1 class="display">{{ t(page.hero.title) }}</h1>
          <p class="lead">{{ t(page.hero.lead) }}</p>
          <div class="hero-actions">
            <BaseButton :to="page.hero.ctaPrimary.to" variant="primary">{{ $t('cta.diagnosis') }}</BaseButton>
            <BaseButton :href="page.hero.ctaSecondary.to" variant="ghost">{{ t(page.hero.ctaSecondary.label) }}</BaseButton>
          </div>
        </div>
        <div class="hero-media">
          <div class="frame">
            <img :src="page.hero.image" :alt="t(page.hero.imageAlt)" width="1200" height="1020">
          </div>
          <a v-if="page.hero.badge" class="hero-badge" :href="page.hero.badge.to">
            <span class="hb-icon"><BaseIcon :name="page.hero.badge.icon" :size="22" /></span>
            <span><b>{{ t(page.hero.badge.label) }}</b><span>{{ t(page.hero.badge.sub) }}</span></span>
          </a>
        </div>
      </div>
    </section>

    <!-- 2 · EL PROBLEMA (split: encuadre fijo + sintomas ordenados) -->
    <section class="section">
      <div class="container split-sticky">
        <div class="sticky-head">
          <div class="section-head">
            <span class="kicker">{{ t(page.problem.kicker) }}</span>
            <h2>{{ t(page.problem.q) }}</h2>
          </div>
          <p class="problem-sub">{{ t(page.problem.sub) }}</p>
          <p class="problem-conclusion">
            {{ t(page.problem.punch.pre) }}<strong>{{ t(page.problem.punch.strong) }}</strong>{{ t(page.problem.punch.post) }}
          </p>
        </div>
        <div class="problem-symptoms reveal">
          <span class="symptoms-label">{{ t({ es: 'Los síntomas', en: 'The symptoms' }) }}</span>
          <StakeList :items="page.problem.symptoms" marker="number" />
        </div>
      </div>
    </section>

    <!-- 3 · QUIÉNES SOMOS (split con foto + highlights) -->
    <section class="section section-alt">
      <div class="container">
        <div class="intro-split">
          <div class="intro-copy">
            <div class="section-head left">
              <span class="kicker">{{ t(page.whoWeAre.kicker) }}</span>
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
        <div class="grid cols-4 reveal" style="margin-top:var(--space-7)">
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

    <!-- 4 · SOLUCIONES (bento) -->
    <div id="soluciones">
      <SolutionsShowcase
        :eyebrow="page.solutions.kicker"
        :title="page.solutions.title"
        :items="solutionItems"
      />
      <div class="container" style="margin-top: calc(-1 * var(--space-6)); padding-bottom: var(--space-8)">
        <p class="center">
          <NuxtLink class="link-arrow" :to="localePath(page.solutions.moreLink.to)">{{ t(page.solutions.moreLink.label) }}</NuxtLink>
        </p>
      </div>
    </div>

    <!-- 5 · MODELO DE 4 CAPAS (flujo numerado) -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.fourLayer.kicker) }}</span>
          <h2>{{ t(page.fourLayer.title) }}</h2>
          <p class="lead">{{ t(page.fourLayer.lead) }}</p>
        </div>
        <div class="grid cols-4 reveal">
          <div v-for="(l, i) in page.fourLayer.layers" :key="i" class="layer-card">
            <span class="layer-num">{{ String(l.num).padStart(2, '0') }}</span>
            <h3>{{ t(l.title) }}</h3>
            <p>{{ t(l.text) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6 · INFRAESTRUCTURA TECNOLÓGICA (feature cards + checklist) -->
    <section class="section">
      <div class="container">
        <div class="ti-head">
          <div class="ti-head-title">
            <span class="kicker">{{ t(page.techInfra.kicker) }}</span>
            <h2>{{ t(page.techInfra.title) }}</h2>
          </div>
          <div class="ti-head-copy">
            <p class="lead">{{ t(page.techInfra.lead) }}</p>
            <p class="ti-body">{{ t(page.techInfra.body) }}</p>
          </div>
        </div>
        <div class="feature-grid cols-3 reveal">
          <div v-for="(col, i) in page.techInfra.columns" :key="i" class="feature">
            <span class="feature-icon"><BaseIcon :name="techIcons[i] || 'cog'" /></span>
            <h3>{{ t(col.title) }}</h3>
            <ul class="check-list">
              <li v-for="(it, j) in col.items" :key="j">
                {{ t(it.label) }}<span v-if="it.note" class="muted"> {{ t(it.note) }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="ti-close">
          <span class="ti-close-icon"><BaseIcon name="target" :size="24" /></span>
          <p>{{ t(page.techInfra.foot) }}</p>
        </div>
      </div>
    </section>

    <!-- 7 · QUÉ INFORMACIÓN GENERA — intro editorial 2 columnas + grid de datos con icono -->
    <section id="informacion" class="section section-alt">
      <div class="container">
        <div class="ti-head">
          <div class="ti-head-title">
            <span class="kicker">{{ t(page.infoGenerated.kicker) }}</span>
            <h2>{{ t(page.infoGenerated.title) }}</h2>
          </div>
          <div class="ti-head-copy">
            <p class="lead">{{ t(page.infoGenerated.lead) }}</p>
          </div>
        </div>
        <div class="grid cols-4 reveal">
          <article v-for="(it, i) in page.infoGenerated.items" :key="i" class="data-card">
            <span class="feature-icon"><BaseIcon :name="infoIcons[i] || 'chart'" :size="22" /></span>
            <h3>{{ t(it.title) }}</h3>
            <p>{{ t(it.desc) }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- 8 · EL RETORNO (paneles con contraste: menos recesivo / mas dominante) -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.retorno.kicker) }}</span>
          <h2>{{ t(page.retorno.title) }}</h2>
          <p class="lead">{{ t(page.retorno.lead) }}</p>
        </div>
        <div class="grid cols-2 reveal">
          <div class="retorno-panel less">
            <span class="retorno-tag">{{ t(page.retorno.lessTitle) }}</span>
            <ul class="mm-list minus">
              <li v-for="(x, i) in page.retorno.less" :key="i">{{ t(x) }}</li>
            </ul>
          </div>
          <div class="retorno-panel more">
            <span class="retorno-tag">{{ t(page.retorno.moreTitle) }}</span>
            <ul class="mm-list plus">
              <li v-for="(x, i) in page.retorno.more" :key="i">{{ t(x) }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 9 · SECTORES QUE ATENDEMOS (cards a sangre) -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.sectorsBlock.kicker) }}</span>
          <h2>{{ t(page.sectorsBlock.title) }}</h2>
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

    <!-- 10 · ECOSISTEMA HIGIENISSA -->
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="kicker">{{ t(page.ecosystem.kicker) }}</span>
          <h2>{{ t(page.ecosystem.title) }}</h2>
          <p class="lead mx-auto">{{ t(page.ecosystem.lead) }}</p>
        </div>
        <div class="grid cols-2 reveal">
          <article v-for="(b, i) in page.ecosystem.items" :key="i" class="card">
            <div class="card-media">
              <img :src="b.image" :alt="t(b.imageAlt)" width="800" height="500" loading="lazy">
            </div>
            <div class="card-body">
              <h3>{{ b.name }}</h3>
              <p class="card-desc">{{ t(b.desc) }}</p>
              <NuxtLink class="link-arrow" :to="localePath(b.to)">{{ t(b.linkLabel) }}</NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 11 · FRANJA DE RESPALDO ASIS IDTRAK (banda oscura con foto) -->
    <section class="asis-strip">
      <div class="container">
        <div class="asis-inner">
          <div class="asis-media">
            <div class="frame">
              <img :src="page.asisStrip.image" :alt="t(page.asisStrip.imageAlt)" width="800" height="500" loading="lazy">
            </div>
          </div>
          <div>
            <p>{{ t(page.asisStrip.body) }}</p>
            <a class="link-arrow" :href="page.asisStrip.to">{{ t(page.asisStrip.linkLabel) }}</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 12 · RESPALDO / BASE INSTALADA (cards por grupo) -->
    <section id="respaldo" class="section section-alt">
      <div class="container">
        <div class="ti-head">
          <div class="ti-head-title">
            <span class="kicker">{{ t(page.respaldo.kicker) }}</span>
            <h2>{{ t(page.respaldo.title) }}</h2>
          </div>
          <div class="ti-head-copy">
            <p class="lead">{{ t(page.respaldo.lead) }}</p>
            <p class="respaldo-note">{{ t(page.respaldo.disclaimer) }}</p>
          </div>
        </div>

        <div v-for="(region, ri) in page.respaldo.regions" :key="ri" class="region-block">
          <div class="region-label">
            <span class="region-name">{{ t(region.region) }}</span>
            <span class="region-line" aria-hidden="true" />
          </div>
          <div class="grid cols-4 reveal">
            <div v-for="(g, gi) in region.groups" :key="gi" class="base-card">
              <h4>{{ t(g.heading) }}</h4>
              <ul class="check-list">
                <li v-for="(it, ii) in g.items" :key="ii">{{ t(it) }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 13 · CTA FINAL -->
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
.h-label span { display: block; }

/* El problema — jerarquia + sintomas numerados (numeros celeste serif, como el bento) */
.problem-sub { color: var(--muted); font-size: 1.02rem; line-height: 1.6; margin: var(--space-4) 0 0; max-width: 44ch; }
.problem-conclusion { margin-top: var(--space-6); font-size: 1.2rem; line-height: 1.4; color: var(--ink); border-left: 4px solid var(--azul); padding-left: var(--space-5); max-width: 44ch; }
.problem-conclusion strong { color: var(--azul); font-weight: 700; }
.symptoms-label { display: block; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: var(--space-4); }
.problem-symptoms :deep(.marker-number .stake-marker) { background: transparent; border: 0; width: 2.2rem; height: auto; color: var(--celeste); font: 400 1.5rem/1 var(--font-display); margin-top: 0; justify-content: flex-start; }

/* 4 capas — flujo numerado (numero grande celeste serif) */
.layer-card { position: relative; background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--space-6); box-shadow: var(--shadow-xs); transition: box-shadow .2s var(--ease), transform .2s var(--ease); }
.layer-card:hover { box-shadow: var(--shadow-sm); transform: translateY(-3px); }
.layer-num { display: block; font: 400 2.4rem/1 var(--font-display); color: var(--celeste); margin-bottom: var(--space-3); }
.layer-card h3 { font-size: 1.15rem; margin-bottom: var(--space-2); }
.layer-card p { margin: 0; color: var(--text); font-size: .95rem; }

/* Checklist con ✓ (infraestructura + base instalada) */
.check-list { list-style: none; margin: var(--space-2) 0 0; padding: 0; display: grid; gap: var(--space-2); }
.check-list li { position: relative; padding-left: 26px; margin: 0; font-size: .93rem; line-height: 1.5; color: var(--text); }
.check-list li::before { content: "\2713"; position: absolute; left: 0; top: 0; width: 18px; height: 1.5em; display: inline-flex; align-items: center; justify-content: center; font: 700 12px/1 var(--font-body); color: var(--azul); }

/* Qué información genera — cards con tile de icono */
.data-card { background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--space-6); box-shadow: var(--shadow-xs); transition: box-shadow .2s var(--ease), transform .2s var(--ease), border-color .2s var(--ease); }
.data-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); border-color: color-mix(in srgb, var(--celeste) 45%, var(--line)); }
.data-card h3 { font-size: 1.05rem; margin: var(--space-2) 0; }
.data-card p { margin: 0; color: var(--text); font-size: .9rem; line-height: 1.5; }

/* El retorno — paneles con contraste */
.retorno-panel { border-radius: var(--radius-lg); padding: clamp(var(--space-6), 3vw, var(--space-7)); border: 1px solid var(--line); }
.retorno-panel.less { background: var(--bg); }
.retorno-panel.more { background: linear-gradient(150deg, rgba(58,120,255,.08), rgba(78,167,225,.06)); border-color: color-mix(in srgb, var(--celeste) 40%, var(--line)); }
.retorno-tag { display: inline-block; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase; padding: 5px 14px; border-radius: 999px; margin-bottom: var(--space-4); }
.retorno-panel.less .retorno-tag { color: var(--muted); background: var(--bg-alt); border: 1px solid var(--line); }
.retorno-panel.more .retorno-tag { color: #fff; background: var(--azul); }
.mm-list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-3); }
.mm-list li { position: relative; padding-left: 28px; margin: 0; color: var(--ink); }
.mm-list li::before { position: absolute; left: 0; top: 0; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font: 700 13px/1 var(--font-body); }
.mm-list.minus li::before { content: "\2212"; color: var(--muted); border: 1.5px solid var(--line); }
.mm-list.plus li::before { content: "+"; color: #fff; background: var(--azul); }

/* Infraestructura — intro editorial en 2 columnas (titulo izq / texto der), no centrado */
.ti-head { display: grid; grid-template-columns: 1fr 1.15fr; gap: clamp(var(--space-6), 5vw, var(--space-9)); align-items: start; margin-bottom: var(--space-8); }
.ti-head-title h2 { margin: 0; }
.ti-head-copy .lead { margin: 0 0 var(--space-4); max-width: none; }
.ti-body { margin: 0; color: var(--muted); }
.ti-close { display: flex; align-items: center; gap: clamp(var(--space-4), 3vw, var(--space-6)); margin-top: var(--space-7); padding: clamp(var(--space-5), 3vw, var(--space-6)); background: linear-gradient(150deg, rgba(58,120,255,.06), rgba(78,167,225,.045)); border: 1px solid var(--line); border-radius: var(--radius-lg); }
.ti-close-icon { flex: none; width: 52px; height: 52px; border-radius: 14px; background: var(--bg); border: 1px solid var(--line); color: var(--azul); display: inline-flex; align-items: center; justify-content: center; }
.ti-close p { margin: 0; color: var(--text); }
@media (max-width: 860px) { .ti-head { grid-template-columns: 1fr; gap: var(--space-4); } }
@media (max-width: 640px) { .ti-close { flex-direction: column; align-items: flex-start; gap: var(--space-4); } }

/* Respaldo — nota legal en la columna del intro */
.respaldo-note { margin: var(--space-4) 0 0; font-size: var(--fs-small); line-height: 1.55; color: var(--muted); border-left: 3px solid var(--gris-marca); padding-left: var(--space-4); }

/* Base instalada — regiones con divisor rotulado + cards por grupo con conteo */
.region-block { margin-top: var(--space-8); }
.region-label { display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-5); }
.region-name { flex: none; font: 400 1.5rem/1 var(--font-display); color: var(--ink); }
.region-line { flex: 1; height: 1px; background: var(--line); }
.base-card { background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--space-5); box-shadow: var(--shadow-xs); }
.base-card h4 { font-family: var(--font-body); font-weight: 700; font-size: .9rem; text-transform: uppercase; letter-spacing: .06em; color: var(--azul); margin: 0 0 var(--space-3); }
</style>
