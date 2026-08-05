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
    icon: s.icon || solutionIcons[i] || 'check',
    title: s.title,
    desc: s.desc,
    groups: [],
  })),
)

const techIcons = ['cog', 'chart', 'users']

// Marca socia del respaldo: nombre + URL editables desde el contenido (fallback ASIS IDTRAK).
const partnerName = computed(() => page.respaldo.partnerName || 'ASIS IDTRAK')
const partnerUrl = computed(() => page.respaldo.partnerUrl || 'https://asisidtrak.com/')
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// Divide un texto en torno al nombre del socio para renderizarlo como link en negrita.
const splitAsis = (val) => t(val).split(new RegExp(`(${escapeRe(partnerName.value)})`))
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

    <!-- 2 · EL PROBLEMA — en vertical: (1) el planteamiento centrado (pregunta marco +
         conclusión); (2) EL IMPACTO OPERATIVO (horas-hombre + riesgo microbiológico) como
         panel a fila completa debajo; (3) los síntomas (el de "horas contando a mano" se
         elevó al impacto, por eso no se repite en la lista). -->
    <section class="section section-alt">
      <div class="container">
        <div class="problem-duo">
          <div class="problem-frame">
            <div class="section-head center">
              <span class="kicker">{{ t(page.problem.kicker) }}</span>
              <h2>{{ t(page.problem.q) }}</h2>
            </div>
            <p v-if="t(page.problem.sub)" class="problem-sub">{{ t(page.problem.sub) }}</p>
            <p class="problem-conclusion">
              {{ t(page.problem.punch.pre) }}<strong>{{ t(page.problem.punch.strong) }}</strong>{{ t(page.problem.punch.post) }}
            </p>
          </div>

          <div v-if="page.problem.impact" class="problem-impact reveal">
            <span class="kicker impact-kicker">{{ t(page.problem.impact.kicker) }}</span>
            <p class="impact-q">{{ t(page.problem.impact.q) }}</p>
            <p class="impact-body">{{ t(page.problem.impact.body) }}</p>
            <div class="impact-cards">
              <article v-for="(c, i) in page.problem.impact.cards" :key="i" class="impact-card">
                <span class="ic-icon"><BaseIcon :name="c.icon || 'check'" :size="22" /></span>
                <h3>{{ t(c.title) }}</h3>
                <p>{{ t(c.text) }}</p>
              </article>
            </div>
          </div>
        </div>

        <div class="problem-symptoms reveal">
          <span class="symptoms-label">{{ t(page.problem.symptomsLabel) }}</span>
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

    <!-- 6 · INFRAESTRUCTURA TECNOLÓGICA (feature cards + checklist) -->
    <section class="section">
      <div class="container">
        <!-- Título centrado (el texto lead/body se retiró por pedido del cliente);
             la galería de infraestructura queda debajo del título. -->
        <div class="section-head center">
          <span class="kicker">{{ t(page.techInfra.kicker) }}</span>
          <h2>{{ t(page.techInfra.title) }}</h2>
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
            <p class="lead"><template v-for="(part, i) in splitAsis(page.respaldo.lead)" :key="i"><a v-if="part === partnerName" class="asis-brand-link" :href="partnerUrl" target="_blank" rel="noopener noreferrer">{{ partnerName }}</a><template v-else>{{ part }}</template></template></p>
            <p class="respaldo-note"><template v-for="(part, i) in splitAsis(page.respaldo.disclaimer)" :key="i"><a v-if="part === partnerName" class="asis-brand-link" :href="partnerUrl" target="_blank" rel="noopener noreferrer">{{ partnerName }}</a><template v-else>{{ part }}</template></template></p>
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

/* El problema — planteamiento centrado (pregunta marco + conclusión) */
.problem-frame { max-width: 62ch; margin: 0 auto; text-align: center; }
.problem-frame .section-head { margin: 0 0 var(--space-4); max-width: none; }
.problem-sub { color: var(--muted); font-size: 1.02rem; line-height: 1.6; margin: var(--space-4) auto 0; max-width: 52ch; }
.problem-conclusion { margin: var(--space-6) auto 0; font-size: 1.2rem; line-height: 1.4; color: var(--ink); max-width: 48ch; }
.problem-conclusion strong { color: var(--azul); font-weight: 700; }

/* Stack vertical: planteamiento centrado arriba + panel de impacto a fila completa debajo */
.problem-duo { display: grid; gap: clamp(var(--space-7), 5vw, var(--space-8)); }

/* Impacto operativo — panel branded a fila completa; cabecera centrada, dos tarjetas debajo */
.problem-impact { background: var(--bg); border: 1px solid color-mix(in srgb, var(--celeste) 34%, var(--line)); border-radius: var(--radius-lg); padding: clamp(var(--space-6), 3.5vw, var(--space-8)); box-shadow: var(--shadow-sm); text-align: center; }
.impact-kicker { color: var(--azul); }
.impact-q { font-family: var(--font-display); font-weight: 500; font-size: clamp(1.35rem, 2.4vw, 1.75rem); line-height: 1.2; color: var(--ink); margin: var(--space-2) auto var(--space-4); max-width: 28ch; text-wrap: balance; }
.impact-body { color: var(--muted); margin: 0 auto var(--space-6); font-size: var(--fs-body-sm); line-height: 1.6; max-width: 64ch; }
.impact-cards { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); max-width: 820px; margin-inline: auto; text-align: left; }
.impact-card { background: var(--bg-alt); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--space-5); }
.ic-icon { display: inline-flex; width: 40px; height: 40px; align-items: center; justify-content: center; border-radius: var(--radius-chip); color: #fff; background: linear-gradient(135deg, var(--azul) 0%, color-mix(in srgb, var(--celeste) 70%, var(--azul)) 100%); box-shadow: 0 4px 12px color-mix(in srgb, var(--azul) 18%, transparent); margin-bottom: var(--space-3); }
.impact-card h3 { font-size: 1.02rem; margin: 0 0 var(--space-2); line-height: 1.2; }
.impact-card p { margin: 0; font-size: var(--fs-small); color: var(--text); line-height: 1.5; }

.problem-symptoms { margin-top: clamp(var(--space-8), 6vw, var(--space-9)); }
.symptoms-label { display: block; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-bottom: var(--space-5); }

@media (max-width: 900px) { .problem-duo { grid-template-columns: 1fr; gap: var(--space-7); } }
@media (max-width: 520px) { .impact-cards { grid-template-columns: 1fr; } }

/* Los síntomas — grilla de 2 columnas con tiles (antes: una sola columna a todo el
   ancho que dejaba mucho vacío a la derecha). Tiles blancos sobre el gris de la
   sección, en la misma familia visual que las cards de "El impacto operativo". El
   último (impar) ocupa la fila completa para no dejar una celda hueca. */
.problem-symptoms :deep(.stake-list) { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
.problem-symptoms :deep(.stake-row) { align-items: center; gap: var(--space-4); border-top: 0; padding: clamp(var(--space-4), 2vw, var(--space-5)); background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow-xs); transition: box-shadow .2s var(--ease), transform .2s var(--ease), border-color .2s var(--ease); }
.problem-symptoms :deep(.stake-row:hover) { box-shadow: var(--shadow-md); transform: translateY(-3px); border-color: color-mix(in srgb, var(--celeste) 45%, var(--line)); }
.problem-symptoms :deep(.stake-row:last-child:nth-child(odd)) { grid-column: 1 / -1; }
.problem-symptoms :deep(.stake-body) { padding-top: 0; }
.problem-symptoms :deep(.stake-text) { font-size: 1rem; line-height: 1.45; }
@media (max-width: 700px) { .problem-symptoms :deep(.stake-list) { grid-template-columns: 1fr; } }

.problem-symptoms :deep(.marker-number .stake-marker) {
  width: 2.6rem; height: 2.6rem; border: 0; border-radius: 12px; margin-top: 0;
  color: #fff; background: linear-gradient(135deg, var(--azul) 0%, color-mix(in srgb, var(--celeste) 70%, var(--azul)) 100%);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--azul) 18%, transparent);
  font: 600 1.1rem/1 var(--font-display); letter-spacing: .01em;
}

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
