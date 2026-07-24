<script setup>
const route = useRoute()
const slug = route.params.slug
const post = await usePostContent(slug)
const posts = await useAllPosts()
const t = useT()
const { locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

const backLabel = { es: '← Recursos', en: '← Resources' }
const relatedLabel = { es: 'Seguí leyendo', en: 'Keep reading' }
const readLabel = { es: 'Leer', en: 'Read' }
const minLabel = { es: 'min de lectura', en: 'min read' }

const slugOf = (p) => (locale.value === 'en' ? p.slugEn : p.slugEs) || p.slugEs
const paragraphs = computed(() => t(post.body || '').split(/\n{2,}/).map((s) => s.trim()).filter(Boolean))
const related = computed(() => posts.filter((p) => p.id !== post.id).slice(0, 3))

const readingMinutes = computed(() => {
  const words = t(post.body || '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
})

const seo = computed(() => post.seo || { title: post.title, description: post.excerpt })
useSeoMeta({
  title: () => t(seo.value.title),
  description: () => t(seo.value.description),
  ogTitle: () => t(seo.value.title),
  ogDescription: () => t(seo.value.description),
  ogType: 'article',
  ogImage: post.coverImage?.url ? `${config.public.siteUrl}${post.coverImage.url}` : undefined,
})
</script>

<template>
  <div>
    <section class="section article-top">
      <div class="container article-head">
        <NuxtLink class="article-back" :to="localePath('/recursos')">{{ t(backLabel) }}</NuxtLink>
        <span class="kicker">{{ t(post.categorySummary?.name) }}</span>
        <h1>{{ t(post.title) }}</h1>
        <p class="article-meta">
          <span v-if="post.author">{{ post.author.name }} {{ post.author.lastName }}</span>
          <span v-if="post.date" aria-hidden="true" class="sep">·</span>
          <span v-if="post.date">{{ t(post.date) }}</span>
          <span aria-hidden="true" class="sep">·</span>
          <span>{{ readingMinutes }} {{ t(minLabel) }}</span>
        </p>
      </div>
      <div v-if="post.coverImage?.url" class="container">
        <div class="article-cover">
          <img :src="post.coverImage.url" :alt="t(post.coverImage.alt)" width="1200" height="620">
        </div>
      </div>
    </section>

    <article class="section article-body">
      <div class="container">
        <div class="prose mx-auto">
          <p v-if="post.excerpt" class="lead">{{ t(post.excerpt) }}</p>
          <p v-for="(para, i) in paragraphs" :key="i">{{ para }}</p>
        </div>
      </div>
    </article>

    <section v-if="related.length" class="section section-alt">
      <div class="container">
        <div class="section-head">
          <h2>{{ t(relatedLabel) }}</h2>
        </div>
        <div class="grid cols-3 reveal">
          <NuxtLink v-for="item in related" :key="item.id" :to="localePath(`/recursos/${slugOf(item)}`)" class="card post-card">
            <div class="card-media">
              <img :src="item.coverImage?.url" :alt="t(item.coverImage?.alt)" width="640" height="400" loading="lazy">
            </div>
            <div class="card-body">
              <span class="card-eyebrow">{{ t(item.categorySummary?.name) }}</span>
              <h3>{{ t(item.title) }}</h3>
              <p class="card-desc">{{ t(item.excerpt) }}</p>
              <span class="link-arrow" style="margin-top:auto">{{ t(readLabel) }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
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
.post-card .card-body { flex: 1; }
</style>
