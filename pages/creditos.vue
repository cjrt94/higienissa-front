<script setup>
const page = usePageContent('creditos')
const t = useT()
useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  robots: 'noindex',
})
</script>

<template>
  <div>
    <PageHero :eyebrow="page.hero.eyebrow" :title="page.hero.title" :lead="page.hero.lead" />
    <section class="section" style="padding-top:0">
      <div class="container">
        <ul class="credits-list">
          <li v-for="(it, i) in page.items" :key="i" class="credits-row">
            <div class="credits-info">
              <strong>{{ t(it.use) }}</strong>
              <span class="muted">{{ it.author }} · {{ it.license }}</span>
            </div>
            <a :href="it.source" target="_blank" rel="noopener" class="link-arrow">Fuente</a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.credits-list { list-style: none; padding: 0; margin: 0; max-width: 820px; display: flex; flex-direction: column; gap: 10px; }
.credits-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 60px; background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: 14px 18px; }
.credits-info { display: flex; flex-direction: column; gap: 3px; }
.credits-info strong { color: var(--ink); font-weight: 600; }
.credits-info .muted { font-size: var(--fs-small); }
</style>
