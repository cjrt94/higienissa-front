<script setup>
const page = usePageContent('home')
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

// ── HERO PREVIEW · FEATURE TEMPORAL (ver composables/useHeroPreview.js) ──────
// Toda la lógica (variantes + persistencia en localStorage) vive en el composable.
// Para quitarlo: borrar el composable, este bloque, el <div.hero-switcher> del
// template y sus estilos, y dejar <HeroHome :data="page.hero" />.
const { options: heroOptions, activeOption } = useHeroPreview()
// ── /HERO PREVIEW ────────────────────────────────────────────────────────────
</script>

<template>
  <div>
    <!-- HERO PREVIEW · hero según la variante activa (al quitar el feature → dejar solo <HeroHome :data="page.hero" />) -->
    <HeroFlow v-if="activeOption === 'flow'" :data="page.hero" />
    <HeroKinetic v-else-if="activeOption === 'kinetic'" :data="page.hero" />
    <HeroHome v-else :data="page.hero" />

    <!-- HERO PREVIEW · switcher flotante (temporal, siempre visible en la home) -->
    <div class="hero-switcher" role="navigation" aria-label="Vista previa de heros">
      <span class="hs-label">Hero:</span>
      <NuxtLink
        v-for="opt in heroOptions" :key="opt.key"
        :to="{ query: { hero: opt.key } }"
        class="hs-btn" :class="{ 'is-active': activeOption === opt.key }"
      >{{ opt.label }}</NuxtLink>
    </div>
    <!-- /HERO PREVIEW -->
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
