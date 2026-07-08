<script setup>
const page = usePageContent('articulo')
const t = useT()
const { t: $t } = useI18n()
const localePath = useLocalePath()

const crumbs = computed(() => [
  { label: $t('nav.home'), to: '/' },
  { label: $t('nav.resources'), to: '/recursos' },
  { label: t({ es: 'Artículo', en: 'Article' }) },
])

const readLabel = { es: 'Leer', en: 'Read' }

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'article',
})
</script>

<template>
  <div>
    <Breadcrumb :items="crumbs" />

    <PageHero
      :eyebrow="page.hero.kicker"
      :title="page.hero.title"
    />

    <!-- Meta del artículo -->
    <div class="container">
      <p class="article-meta">
        <span>{{ t(page.hero.meta.category) }}</span>
        <span aria-hidden="true" class="sep">·</span>
        <span>{{ t(page.hero.meta.date) }}</span>
        <span aria-hidden="true" class="sep">·</span>
        <span>{{ t(page.hero.meta.author) }}</span>
      </p>
    </div>

    <!-- Cuerpo del artículo -->
    <article class="section">
      <div class="container">
        <div class="prose">
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

    <FinalCta :data="page.finalCta" />

    <!-- Artículos relacionados -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head left">
          <span class="kicker">{{ t(page.related.kicker) }}</span>
          <h2>{{ t(page.related.title) }}</h2>
        </div>
        <div class="grid cols-3">
          <article v-for="(item, i) in page.related.items" :key="i" class="card">
            <div class="card-media">
              <img :src="item.image" :alt="t(item.imageAlt)" width="800" height="500" loading="lazy">
            </div>
            <div class="card-body">
              <span class="chip">{{ t(item.chip) }}</span>
              <h3>{{ t(item.title) }}</h3>
              <p class="card-desc">{{ t(item.desc) }}</p>
              <NuxtLink class="link-arrow" :to="localePath(item.to)">{{ t(readLabel) }}</NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  align-items: center;
  margin: 0 0 var(--space-2);
  color: var(--muted);
  font-size: var(--fs-small);
}
.article-meta .sep { color: var(--line); }

.article-figure { margin: var(--space-6) 0; }
.article-figure img {
  width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  background: var(--bg-alt);
}
.article-figure figcaption {
  margin-top: var(--space-3);
  color: var(--muted);
  font-size: var(--fs-small);
  text-align: center;
}

.card-body .chip { align-self: flex-start; }
</style>
