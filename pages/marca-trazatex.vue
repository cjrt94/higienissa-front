<script setup>
const page = await useBrandContent('trazatex')
const t = useT()
const config = useRuntimeConfig()

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'website',
  ogImage: `${config.public.siteUrl}${page.hero.image}`,
})

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

// Divide un texto en torno a "ASIS IDTRAK" para renderizar la marca como link en negrita.
const splitAsis = (val) => t(val).split(/(ASIS IDTRAK)/)
</script>

<template>
  <div>
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
    <section class="section section-alt">
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

    <!-- 4 · SOLUCIONES (bento) -->
    <div id="soluciones">
      <SolutionsShowcase
        :eyebrow="page.solutions.kicker"
        :title="page.solutions.title"
        :items="solutionItems"
      />
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
        <!-- Galería: hardware RFID real en instalaciones (prueba tangible de la infraestructura) -->
        <div v-if="page.techInfra.gallery" class="tech-gallery reveal">
          <figure v-for="(g, i) in page.techInfra.gallery" :key="i" class="tg-item">
            <img :src="g.image" :alt="t(g.alt)" width="900" height="1600" loading="lazy">
          </figure>
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

    <!-- 6b · LA PLATAFORMA EN VIVO (showcase con pestañas del panel del socio ASIS) -->
    <PlatformShowcase v-if="page.platform" :data="page.platform" />

    <!-- 7+8 · EL RETORNO (con "Qué información genera" fusionado) -->
    <section class="section section-alt">
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

        <!-- "Qué información genera" fusionado dentro de El retorno -->
        <div id="informacion" class="ti-head info-in-retorno">
          <div class="ti-head-title">
            <span class="kicker">{{ t(page.infoGenerated.kicker) }}</span>
            <h2>{{ t(page.infoGenerated.title) }}</h2>
          </div>
          <div class="ti-head-copy">
            <p class="lead">{{ t(page.infoGenerated.lead) }}</p>
          </div>
        </div>
        <dl class="def-cols reveal">
          <div v-for="(it, i) in page.infoGenerated.items" :key="i" class="def-item">
            <dt>{{ t(it.title) }}</dt>
            <dd>{{ t(it.desc) }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- 12 · RESPALDO / BASE INSTALADA (cards por grupo). Superficie blanca:
         al retirar la franja ASIS, queda pegado al Retorno (gris) — así se separa.
         "ASIS IDTRAK" se refuerza en el copy (negrita + link a su web). -->
    <section id="respaldo" class="section">
      <div class="container">
        <div class="ti-head">
          <div class="ti-head-title">
            <span class="kicker">{{ t(page.respaldo.kicker) }}</span>
            <h2>{{ t(page.respaldo.title) }}</h2>
          </div>
          <div class="ti-head-copy">
            <p class="lead"><template v-for="(part, i) in splitAsis(page.respaldo.lead)" :key="i"><a v-if="part === 'ASIS IDTRAK'" class="asis-brand-link" href="https://asisidtrak.com/" target="_blank" rel="noopener noreferrer">ASIS IDTRAK</a><template v-else>{{ part }}</template></template></p>
            <p class="respaldo-note"><template v-for="(part, i) in splitAsis(page.respaldo.disclaimer)" :key="i"><a v-if="part === 'ASIS IDTRAK'" class="asis-brand-link" href="https://asisidtrak.com/" target="_blank" rel="noopener noreferrer">ASIS IDTRAK</a><template v-else>{{ part }}</template></template></p>
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

    <!-- 12b · ECOSISTEMA HIGIENISSA — pipeline de 3 marcas (Trazatex actual).
         Gris (alt por defecto): separa del Respaldo, que ahora es blanco. -->
    <EcosystemPipeline
      :eyebrow="page.ecosystem.kicker"
      :title="page.ecosystem.title"
      :lead="page.ecosystem.lead"
      current="trazatex"
    />

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

/* El problema — jerarquia + sintomas numerados (badge azul en degradado, como el home) */
.problem-sub { color: var(--muted); font-size: 1.02rem; line-height: 1.6; margin: var(--space-4) 0 0; max-width: 44ch; }
.problem-conclusion { margin-top: var(--space-6); font-size: 1.2rem; line-height: 1.4; color: var(--ink); max-width: 44ch; }
.problem-conclusion strong { color: var(--azul); font-weight: 700; }
.symptoms-label { display: block; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: var(--space-4); }
.problem-symptoms :deep(.marker-number .stake-marker) {
  width: 2.6rem; height: 2.6rem; border: 0; border-radius: 12px; margin-top: 0;
  color: #fff; background: linear-gradient(135deg, var(--azul) 0%, color-mix(in srgb, var(--celeste) 70%, var(--azul)) 100%);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--azul) 18%, transparent);
  font: 600 1.1rem/1 var(--font-display); letter-spacing: .01em;
}

/* 4 capas — flujo numerado (mismo badge del home "Lo que nos define") */
.layer-card { position: relative; background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--space-6); box-shadow: var(--shadow-xs); transition: box-shadow .2s var(--ease), transform .2s var(--ease); }
.layer-card:hover { box-shadow: var(--shadow-sm); transform: translateY(-3px); }
.layer-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 3rem; height: 3rem; border-radius: 14px; margin-bottom: var(--space-4);
  color: #fff; background: linear-gradient(135deg, var(--azul) 0%, color-mix(in srgb, var(--celeste) 70%, var(--azul)) 100%);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--azul) 18%, transparent);
  font: 600 1.35rem/1 var(--font-display); letter-spacing: .01em;
}
.layer-card h3 { font-size: 1.15rem; margin-bottom: var(--space-2); }
.layer-card p { margin: 0; color: var(--text); font-size: .95rem; }

/* Checklist con ✓ (infraestructura + base instalada) — check alineado a la 1.ª línea */
.check-list { list-style: none; margin: var(--space-2) 0 0; padding: 0; display: grid; gap: var(--space-2); }
.check-list li { display: flex; gap: 10px; align-items: flex-start; margin: 0; font-size: .93rem; line-height: 1.5; color: var(--text); }
.check-list li::before { content: "\2713"; flex: none; color: var(--azul); font-weight: 700; }

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

/* Galería de infraestructura RFID (fotos reales en instalaciones) */
.tech-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); margin-bottom: clamp(var(--space-7), 5vw, var(--space-8)); }
.tg-item { margin: 0; position: relative; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-sm); aspect-ratio: 3/4; background: var(--bg-alt); }
.tg-item img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s var(--ease); }
.tg-item:hover img { transform: scale(1.04); }
@media (max-width: 760px) { .tech-gallery { grid-template-columns: 1fr; gap: var(--space-3); } }
.info-in-retorno { margin-top: var(--space-10); }
.ti-close { display: flex; align-items: center; gap: clamp(var(--space-4), 3vw, var(--space-6)); margin-top: var(--space-7); padding: clamp(var(--space-5), 3vw, var(--space-6)); background: linear-gradient(150deg, rgba(58,120,255,.06), rgba(78,167,225,.045)); border: 1px solid var(--line); border-radius: var(--radius-lg); }
.ti-close-icon { flex: none; width: 52px; height: 52px; border-radius: 14px; background: var(--bg); border: 1px solid var(--line); color: var(--azul); display: inline-flex; align-items: center; justify-content: center; }
.ti-close p { margin: 0; color: var(--text); }
@media (max-width: 860px) { .ti-head { grid-template-columns: 1fr; gap: var(--space-4); } }
@media (max-width: 640px) { .ti-close { flex-direction: column; align-items: flex-start; gap: var(--space-4); } }

/* ASIS IDTRAK reforzado en el copy del respaldo: negrita + link a su web */
.asis-brand-link { color: var(--azul); font-weight: 700; text-decoration: none; border-bottom: 1px solid color-mix(in srgb, var(--azul) 35%, transparent); transition: border-color .18s var(--ease); }
.asis-brand-link:hover { border-bottom-color: var(--azul); }

/* Respaldo — nota legal en la columna del intro */
.respaldo-note { margin: var(--space-4) 0 0; font-size: var(--fs-small); line-height: 1.55; color: var(--muted); }

/* Base instalada — regiones con divisor rotulado + cards por grupo con conteo */
.region-block { margin-top: var(--space-8); }
.region-label { display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-5); }
.region-name { flex: none; font: 400 1.5rem/1 var(--font-display); color: var(--ink); }
.region-line { flex: 1; height: 1px; background: var(--line); }
.base-card { background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--space-5); box-shadow: var(--shadow-xs); }
.base-card h4 { font-family: var(--font-body); font-weight: 700; font-size: .9rem; text-transform: uppercase; letter-spacing: .06em; color: var(--azul); margin: 0 0 var(--space-3); }
</style>
