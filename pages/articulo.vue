<script setup>
const page = usePageContent('articulo')
const t = useT()
const { t: $t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

const readLabel = { es: 'Leer', en: 'Read' }
const backLabel = { es: '← Recursos', en: '← Resources' }
const minLabel = { es: 'min de lectura', en: 'min read' }

// Tiempo de lectura estimado (≈200 palabras/min) sobre el cuerpo del artículo
const readingMinutes = computed(() => {
  const blocks = page.body?.blocks || []
  let words = t(page.body?.lead || '').split(/\s+/).filter(Boolean).length
  for (const b of blocks) {
    if (b.type === 'paragraph' || b.type === 'heading' || b.type === 'quote') {
      words += t(b.text || '').split(/\s+/).filter(Boolean).length
    } else if (b.type === 'list') {
      for (const it of b.items || []) words += (t(it.term || '') + ' ' + t(it.desc || '')).split(/\s+/).filter(Boolean).length
    }
  }
  return Math.max(1, Math.round(words / 200))
})

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'article',
  ogImage: `${config.public.siteUrl}${page.hero.image}`,
})
</script>

<template>
  <div>
    <!-- 1 · Cabecera del artículo + portada -->
    <section class="section article-top">
      <div class="container article-head">
        <NuxtLink class="article-back" :to="localePath('/recursos')">{{ t(backLabel) }}</NuxtLink>
        <span class="kicker">{{ t(page.hero.kicker) }}</span>
        <h1>{{ t(page.hero.title) }}</h1>
        <p class="article-meta">
          <span>{{ t(page.hero.meta.author) }}</span>
          <span aria-hidden="true" class="sep">·</span>
          <span>{{ t(page.hero.meta.date) }}</span>
          <span aria-hidden="true" class="sep">·</span>
          <span>{{ readingMinutes }} {{ t(minLabel) }}</span>
        </p>
      </div>
      <div class="container">
        <div class="article-cover">
          <img :src="page.hero.image" :alt="t(page.hero.imageAlt)" width="1200" height="620">
        </div>
      </div>
    </section>

    <!-- 2 · Cuerpo -->
    <article class="section article-body">
      <div class="container">
        <div class="prose mx-auto">
          <p class="lead">{{ t(page.body.lead) }}</p>
          <template v-for="(block, i) in page.body.blocks" :key="i">
            <h2 v-if="block.type === 'heading'">{{ t(block.text) }}</h2>
            <p v-else-if="block.type === 'paragraph'">{{ t(block.text) }}</p>
            <figure v-else-if="block.type === 'image'" class="article-figure">
              <img :src="block.src" :alt="t(block.alt)" width="1200" height="600" loading="lazy">
              <figcaption v-if="block.caption">{{ t(block.caption) }}</figcaption>
            </figure>
            <ul v-else-if="block.type === 'list'">
              <li v-for="(item, j) in block.items" :key="j">
                <strong>{{ t(item.term) }}</strong> — {{ t(item.desc) }}
              </li>
            </ul>
            <blockquote v-else-if="block.type === 'quote'">
              <p>{{ t(block.text) }}</p>
            </blockquote>
          </template>
        </div>
      </div>
    </article>

    <!-- 3 · Relacionados -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.related.kicker) }}</span>
          <h2>{{ t(page.related.title) }}</h2>
        </div>
        <div class="grid cols-3 reveal">
          <NuxtLink v-for="(item, i) in page.related.items" :key="i" :to="localePath(item.to)" class="card post-card">
            <div class="card-media">
              <img :src="item.image" :alt="t(item.imageAlt)" width="640" height="400" loading="lazy">
            </div>
            <div class="card-body">
              <span class="card-eyebrow">{{ t(item.chip) }}</span>
              <h3>{{ t(item.title) }}</h3>
              <p class="card-desc">{{ t(item.desc) }}</p>
              <span class="link-arrow" style="margin-top:auto">{{ t(readLabel) }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <FinalCta :data="page.finalCta" />
  </div>
</template>

<style scoped>
.article-top { padding-bottom: 0; }
.article-head { max-width: 760px; margin: 0 auto var(--space-7); text-align: center; }
.article-back { display: inline-block; margin-bottom: var(--space-4); font: 600 var(--fs-small) var(--font-body); color: var(--muted); }
.article-back:hover { color: var(--azul); }
.article-head h1 { font-size: var(--fs-h1); margin-bottom: var(--space-4); }
.article-meta { display: flex; justify-content: center; flex-wrap: wrap; gap: var(--space-2); font-size: var(--fs-small); color: var(--muted); margin: 0; }
.article-meta .sep { color: var(--line); }
.article-cover { max-width: 980px; margin: 0 auto; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md); aspect-ratio: 16/7; background: var(--bg-alt); }
.article-cover img { width: 100%; height: 100%; object-fit: cover; }
.article-body .prose { max-width: 68ch; }
.article-body .prose .lead { margin-bottom: var(--space-6); }
.article-figure { margin: var(--space-6) 0; }
.article-figure img { border-radius: var(--radius); }
.article-figure figcaption { font-size: var(--fs-small); color: var(--muted); margin-top: var(--space-2); }
.post-card .card-body { flex: 1; }
</style>
