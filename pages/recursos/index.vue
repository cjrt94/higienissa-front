<script setup>
const page = await usePageContent('recursos')
const posts = await useAllPosts()
const categories = await usePostCategories()
const t = useT()
const { locale } = useI18n()
const config = useRuntimeConfig()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'website',
  ogImage: `${config.public.siteUrl}/img/ecosistema.jpg`,
})

const slugOf = (p) => (locale.value === 'en' ? p.slugEn : p.slugEs) || p.slugEs
const readLabel = { es: 'Leer', en: 'Read' }

// Filtro por categoría (cliente). '' = todas.
const activeCat = ref('')
const filteredPosts = computed(() =>
  activeCat.value ? posts.filter((p) => p.categoryRef === activeCat.value) : posts,
)

const PAGE_SIZE = 9
const showPagination = computed(() => filteredPosts.value.length > PAGE_SIZE)
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <div class="hub-head">
          <div>
            <span class="kicker">{{ t(page.hero.eyebrow) }}</span>
            <h1 class="display">{{ t(page.hero.title) }}</h1>
          </div>
          <div class="hub-head-aside">
            <p class="lead">{{ t(page.hero.lead) }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="chips" role="group" :aria-label="t(page.filters.label)">
          <button type="button" class="chip" :class="{ active: activeCat === '' }" :aria-pressed="activeCat === '' ? 'true' : 'false'" @click="activeCat = ''">
            {{ t(page.filters.items?.[0]?.label) || 'Todos' }}
          </button>
          <button
            v-for="c in categories"
            :key="c.id"
            type="button"
            class="chip"
            :class="{ active: activeCat === c.id }"
            :aria-pressed="activeCat === c.id ? 'true' : 'false'"
            @click="activeCat = c.id"
          >
            {{ t(c.name) }}
          </button>
        </div>

        <div v-if="filteredPosts.length" class="grid cols-3 reveal stagger" style="margin-top: var(--space-6)">
          <NuxtLink v-for="post in filteredPosts.slice(0, PAGE_SIZE)" :key="post.id" :to="localePath(`/recursos/${slugOf(post)}`)" class="card post-card">
            <div class="card-media">
              <img :src="post.coverImage?.url" :alt="t(post.coverImage?.alt)" width="640" height="400" loading="lazy" decoding="async">
            </div>
            <div class="card-body">
              <span class="card-eyebrow">{{ t(post.categorySummary?.name) }}</span>
              <h3>{{ t(post.title) }}</h3>
              <p class="card-desc">{{ t(post.excerpt) }}</p>
              <div class="post-foot">
                <span class="post-date">{{ t(post.date) }}</span>
                <span class="link-arrow">{{ t(page.posts.readLabel) || t(readLabel) }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
        <p v-else style="margin-top: var(--space-6); color: var(--muted)">No hay artículos en esta categoría.</p>

        <nav v-if="showPagination" class="pagination" :aria-label="t(page.pagination.label)">
          <span class="page-prev" aria-disabled="true">{{ t(page.pagination.prevLabel) }}</span>
          <span class="current" aria-current="page">1</span>
          <NuxtLink class="page-next" :to="localePath('/recursos')">{{ t(page.pagination.nextLabel) }}</NuxtLink>
        </nav>
      </div>
    </section>

    <FinalCta :data="page.finalCta" />
  </div>
</template>

<style scoped>
.post-card .card-body { flex: 1; }
.post-foot { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); margin-top: auto; padding-top: var(--space-3); }
.post-date { font-size: var(--fs-small); color: var(--muted); }
</style>
