<script setup>
const page = useBrandContent('trazatex')
const t = useT()
const config = useRuntimeConfig()
const localePath = useLocalePath()

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
</script>

<template>
  <div>
    <Breadcrumb :items="breadcrumb" />

    <!-- ===== HERO DE MARCA ===== -->
    <section class="page-hero with-media">
      <div class="container page-hero-grid">
        <div class="page-hero-copy">
          <a class="badge" :href="page.hero.badge.to">{{ t(page.hero.badge.label) }}</a>
          <span class="kicker">{{ t(page.hero.eyebrow) }}</span>
          <h1>{{ t(page.hero.title) }}</h1>
          <p class="lead">{{ t(page.hero.lead) }}</p>
          <div class="hero-actions">
            <BaseButton :to="page.hero.ctaPrimary.to" variant="primary">{{ $t('cta.diagnosis') }}</BaseButton>
            <BaseButton :href="page.hero.ctaSecondary.to" variant="ghost">{{ t(page.hero.ctaSecondary.label) }}</BaseButton>
          </div>
        </div>
        <div class="page-hero-media">
          <div class="frame">
            <img :src="page.hero.image" :alt="t(page.hero.imageAlt)" width="1000" height="800">
          </div>
        </div>
      </div>
    </section>

    <!-- ===== EL PROBLEMA ===== -->
    <section class="section">
      <div class="container">
        <div class="statement">
          <span class="kicker">{{ t(page.problem.kicker) }}</span>
          <p class="statement-q">{{ t(page.problem.q) }}</p>
          <p class="statement-sub">{{ t(page.problem.sub) }}</p>
        </div>
        <ul class="marker-list risk cols-2" style="margin-top: var(--space-7)">
          <li v-for="(s, i) in page.problem.symptoms" :key="i">{{ t(s) }}</li>
        </ul>
        <p class="problem-punch" style="margin-top: var(--space-7)">
          {{ t(page.problem.punch.pre) }}<strong>{{ t(page.problem.punch.strong) }}</strong>{{ t(page.problem.punch.post) }}
        </p>
      </div>
    </section>

    <!-- ===== QUIÉNES SOMOS ===== -->
    <section class="section section-alt">
      <div class="container intro-split">
        <div class="intro-copy">
          <div class="section-head left">
            <span class="kicker">{{ t(page.whoWeAre.kicker) }}</span>
            <h2>{{ t(page.whoWeAre.title) }}</h2>
            <p class="lead">{{ t(page.whoWeAre.lead) }}</p>
          </div>
        </div>
        <div class="highlight-stack">
          <div v-for="(h, i) in page.whoWeAre.highlights" :key="i" class="highlight">
            <span class="h-label">{{ t(h.label) }}</span>
            <p>{{ t(h.text) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== SOLUCIONES ===== -->
    <section id="soluciones" class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.solutions.kicker) }}</span>
          <h2>{{ t(page.solutions.title) }}</h2>
        </div>
        <div class="grid cols-3">
          <article v-for="(s, i) in page.solutions.items" :key="i" class="card">
            <div class="card-body">
              <h3>{{ t(s.title) }}</h3>
              <p class="card-desc">{{ t(s.desc) }}</p>
            </div>
          </article>
        </div>
        <p class="center" style="margin-top: var(--space-6)">
          <NuxtLink class="link-arrow" :to="localePath(page.solutions.moreLink.to)">{{ t(page.solutions.moreLink.label) }}</NuxtLink>
        </p>
      </div>
    </section>

    <!-- ===== MODELO DE 4 CAPAS ===== -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.fourLayer.kicker) }}</span>
          <h2>{{ t(page.fourLayer.title) }}</h2>
          <p class="lead">{{ t(page.fourLayer.lead) }}</p>
        </div>
        <div class="feature-grid cols-4">
          <div v-for="(l, i) in page.fourLayer.layers" :key="i" class="feature">
            <span class="feature-kicker">{{ l.num }}</span>
            <h3>{{ t(l.title) }}</h3>
            <p>{{ t(l.text) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== INFRAESTRUCTURA TECNOLÓGICA ===== -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.techInfra.kicker) }}</span>
          <h2>{{ t(page.techInfra.title) }}</h2>
          <p class="lead">{{ t(page.techInfra.lead) }}</p>
          <p>{{ t(page.techInfra.body) }}</p>
        </div>
        <div class="grid cols-3">
          <article v-for="(col, i) in page.techInfra.columns" :key="i" class="card">
            <div class="card-body">
              <h3>{{ t(col.title) }}</h3>
              <ul>
                <li v-for="(it, j) in col.items" :key="j">
                  {{ t(it.label) }}<span v-if="it.note" class="muted"> {{ t(it.note) }}</span>
                </li>
              </ul>
            </div>
          </article>
        </div>
        <p class="lead center mx-auto" style="margin-top: var(--space-6)">{{ t(page.techInfra.foot) }}</p>
      </div>
    </section>

    <!-- ===== QUÉ INFORMACIÓN GENERA ===== -->
    <section id="informacion" class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.infoGenerated.kicker) }}</span>
          <h2>{{ t(page.infoGenerated.title) }}</h2>
          <p class="lead">{{ t(page.infoGenerated.lead) }}</p>
        </div>
        <div class="grid cols-4">
          <article v-for="(it, i) in page.infoGenerated.items" :key="i" class="card">
            <div class="card-body">
              <h3>{{ t(it.title) }}</h3>
              <p class="card-desc">{{ t(it.desc) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== EL RETORNO ===== -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.retorno.kicker) }}</span>
          <h2>{{ t(page.retorno.title) }}</h2>
          <p class="lead">{{ t(page.retorno.lead) }}</p>
        </div>
        <div class="grid cols-2">
          <div>
            <h3>{{ t(page.retorno.lessTitle) }}</h3>
            <ul class="marker-list less">
              <li v-for="(x, i) in page.retorno.less" :key="i">{{ t(x) }}</li>
            </ul>
          </div>
          <div>
            <h3>{{ t(page.retorno.moreTitle) }}</h3>
            <ul class="marker-list more">
              <li v-for="(x, i) in page.retorno.more" :key="i">{{ t(x) }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== SECTORES QUE ATENDEMOS ===== -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.sectorsBlock.kicker) }}</span>
          <h2>{{ t(page.sectorsBlock.title) }}</h2>
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

    <!-- ===== ECOSISTEMA HIGIENISSA ===== -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.ecosystem.kicker) }}</span>
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
              <NuxtLink class="link-arrow" :to="localePath(b.to)">{{ t(b.linkLabel) }}</NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== FRANJA DE RESPALDO ASIS IDTRAK ===== -->
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

    <!-- ===== RESPALDO / BASE INSTALADA ===== -->
    <section id="respaldo" class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.respaldo.kicker) }}</span>
          <h2>{{ t(page.respaldo.title) }}</h2>
          <p class="lead">{{ t(page.respaldo.lead) }}</p>
        </div>

        <p class="disclaimer">{{ t(page.respaldo.disclaimer) }}</p>

        <template v-for="(region, ri) in page.respaldo.regions" :key="ri">
          <h3 style="margin-top: var(--space-7)">{{ t(region.region) }}</h3>
          <div class="installed-base">
            <div v-for="(g, gi) in region.groups" :key="gi">
              <h4>{{ t(g.heading) }}</h4>
              <ul>
                <li v-for="(it, ii) in g.items" :key="ii">{{ t(it) }}</li>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- ===== CTA FINAL ===== -->
    <section class="section cta-band">
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
