<script setup>
const page = usePageContent('home')
const t = useT()
const config = useRuntimeConfig()
const route = useRoute()

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'website',
  ogImage: `${config.public.siteUrl}${page.hero.image}`,
})

// --- Preview de hero por query param (?hero=flow) ---
// Sin param → hero actual (visitantes normales). El switcher solo aparece en preview.
// resolveComponent porque <component :is="string"> no lo resuelve el auto-import de Nuxt.
const heroComponents = {
  '': resolveComponent('HeroHome'),
  flow: resolveComponent('HeroFlow'),
}
const heroComponent = computed(() => heroComponents[route.query.hero] || heroComponents[''])
const previewMode = computed(() => route.query.hero != null)
const heroOptions = [
  { key: 'actual', label: 'Actual' },
  { key: 'flow', label: 'Flujo' },
]
</script>

<template>
  <div>
    <component :is="heroComponent" :data="page.hero" />

    <div v-if="previewMode" class="hero-switcher" role="navigation" aria-label="Vista previa de heros">
      <span class="hs-label">Hero:</span>
      <NuxtLink
        v-for="opt in heroOptions" :key="opt.key"
        :to="{ query: { hero: opt.key } }"
        class="hs-btn" :class="{ 'is-active': (route.query.hero || 'actual') === opt.key }"
      >{{ opt.label }}</NuxtLink>
    </div>
    <GroupIntro :data="page.groupIntro" />
    <DivisionsGrid :data="page.divisions" />
    <PillarsGrid :data="page.pillars" />
    <SectorsGrid :data="page.sectorsBlock" />
    <FinalCta :data="page.finalCta" />
  </div>
</template>

<style scoped>
.hero-switcher {
  position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 60;
  display: flex; align-items: center; gap: 4px;
  padding: 6px 8px; border-radius: 999px;
  background: rgba(15,24,54,.92); backdrop-filter: blur(8px);
  box-shadow: 0 8px 30px rgba(0,0,0,.28); color: #fff;
}
.hs-label { font: 700 var(--fs-kicker)/1 var(--font-body); letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.6); padding: 0 6px; }
.hs-btn { font: 600 var(--fs-small) var(--font-body); color: rgba(255,255,255,.82); padding: 7px 14px; border-radius: 999px; transition: background .16s ease, color .16s ease; }
.hs-btn:hover { background: rgba(255,255,255,.12); color: #fff; }
.hs-btn.is-active { background: #fff; color: var(--azul); }
@media (max-width: 560px) { .hs-btn { padding: 6px 10px; } .hs-label { display: none; } }
</style>
