<script setup>
const page = useLegalContent('aviso-legal')
const t = useT()
const settings = useSettings()

// Atribución de imágenes de terceros con licencia CC (obligatoria) — vive aquí, al
// final del aviso legal, no en el footer global.
const imageCredits = settings.imageCredits || []
const creditsLabel = { es: 'Créditos de imágenes', en: 'Image credits' }
const creditsIntro = {
  es: 'Algunas imágenes de terceros se utilizan bajo licencia Creative Commons, con atribución a sus autores:',
  en: 'Some third-party images are used under a Creative Commons license, with attribution to their authors:',
}
const sourceLabel = { es: 'fuente', en: 'source' }

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'website',
})
</script>

<template>
  <div>
    <PageHero
      :eyebrow="page.hero.eyebrow"
      :title="page.hero.title"
      :lead="page.hero.lead"
    />

    <section class="section">
      <div class="container">
        <div class="prose legal-prose">
          <template v-for="(sec, i) in page.sections" :key="i">
            <h2>{{ t(sec.heading) }}</h2>
            <p v-for="(par, j) in sec.body" :key="j">{{ t(par) }}</p>
          </template>

          <template v-if="imageCredits.length">
            <h2>{{ t(creditsLabel) }}</h2>
            <p>{{ t(creditsIntro) }}</p>
            <ul class="legal-credits">
              <li v-for="(c, i) in imageCredits" :key="i">
                {{ t(c.use) }} — {{ c.author }}, {{ c.license }}
                (<a :href="c.source" target="_blank" rel="noopener noreferrer">{{ t(sourceLabel) }}</a>)
              </li>
            </ul>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.legal-prose h2 { font-size: var(--fs-h4, 1.25rem); }
.legal-prose h2:first-child { margin-top: 0; }
.legal-prose p { margin-bottom: var(--space-4); color: var(--text); line-height: 1.7; }
.legal-credits { list-style: none; margin: 0; padding: 0; }
.legal-credits li { margin: 0 0 var(--space-2); font-size: var(--fs-small); color: var(--muted); line-height: 1.6; }
.legal-credits a { color: var(--azul); }
</style>
