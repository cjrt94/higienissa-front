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

    <PageHero
      :eyebrow="page.hero.eyebrow"
      :title="page.hero.title"
      :lead="page.hero.lead"
    />

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

        <div class="grid cols-3" style="margin-top: var(--space-6)">
          <article v-for="(post, i) in page.posts.items" :key="i" class="card">
            <div class="card-media">
              <img :src="post.image" :alt="t(post.imageAlt)" width="640" height="400" loading="lazy">
            </div>
            <div class="card-body">
              <span class="card-eyebrow">{{ t(post.category) }}</span>
              <h3>{{ t(post.title) }}</h3>
              <p class="card-desc">{{ t(post.excerpt) }}</p>
              <p class="muted">{{ t(post.date) }}</p>
              <NuxtLink :to="localePath(post.to)" class="link-arrow">{{ t(page.posts.readLabel) }}</NuxtLink>
            </div>
          </article>
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
