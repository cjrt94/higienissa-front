<script setup>
const page = usePageContent('recursos')
const t = useT()
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
</script>

<template>
  <div>
    <Breadcrumb :items="[{ label: $t('nav.home'), to: '/' }, { label: $t('nav.resources') }]" />

    <!-- Hero editorial (título izq / lead der); las post-cards con thumbnail son el payload visual -->
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
        <div class="chips" role="list" :aria-label="t(page.filters.label)">
          <button
            v-for="(f, i) in page.filters.items"
            :key="i"
            type="button"
            role="listitem"
            class="chip"
            :class="{ active: f.active }"
            :aria-pressed="f.active ? 'true' : 'false'"
          >
            {{ t(f.label) }}
          </button>
        </div>

        <div class="grid cols-3 reveal" style="margin-top: var(--space-6)">
          <NuxtLink v-for="(post, i) in page.posts.items" :key="i" :to="localePath(post.to)" class="card post-card">
            <div class="card-media">
              <img :src="post.image" :alt="t(post.imageAlt)" width="640" height="400" loading="lazy">
            </div>
            <div class="card-body">
              <span class="card-eyebrow">{{ t(post.category) }}</span>
              <h3>{{ t(post.title) }}</h3>
              <p class="card-desc">{{ t(post.excerpt) }}</p>
              <div class="post-foot">
                <span class="post-date">{{ t(post.date) }}</span>
                <span class="link-arrow">{{ t(page.posts.readLabel) }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <nav class="pagination" :aria-label="t(page.pagination.label)">
          <span class="page-prev" aria-disabled="true">{{ t(page.pagination.prevLabel) }}</span>
          <template v-for="p in page.pagination.pages" :key="p">
            <span v-if="p === page.pagination.current" class="current" aria-current="page">{{ p }}</span>
            <NuxtLink v-else :to="localePath('/recursos')">{{ p }}</NuxtLink>
          </template>
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
