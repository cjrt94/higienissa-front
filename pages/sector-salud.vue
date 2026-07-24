<script setup>
const page = await useSectorContent('salud')
// Hero de tope = foto oscura a sangre → el navbar transparente va en blanco (contraste AA).
definePageMeta({ darkHero: true })
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

// El acento de sector (--sector / --sector-ink / --sector-soft) es único para
// los 4 sectores y se define en .sector-page (assets/css/site.css).
const contextItems = computed(() => page.context.unknowns.map((u) => ({ text: u })))
const shiftItems = computed(() => page.whatChanges.items.map((x) => ({ text: x })))
const roleItems = computed(() => page.impactByRole.items.map((r) => ({ title: r.role, desc: r.desc })))
const brandItems = computed(() =>
  page.brands.items.map((b) => ({
    name: b.name, eyebrow: b.eyebrow, role: b.role, desc: b.desc,
    image: b.image, imageAlt: b.imageAlt, to: b.to, link: b.cta,
  })),
)
</script>

<template>
  <div class="sector-page">
    <SectorHero
      :icon="page.icon"
      :eyebrow="page.hero.eyebrow"
      :title="page.hero.title"
      :lead="page.hero.lead"
      :image="page.hero.image"
      :image-alt="page.hero.imageAlt"
      :badge="page.hero.badge"
    />

    <SectorContext
      :kicker="page.context.kicker"
      :title="page.context.title"
      :lead="page.context.lead"
      :image="page.context.image"
      :image-alt="page.context.imageAlt"
      :label="page.context.unknownsLabel"
      :items="contextItems"
      variant="ask"
    />

    <SectorRisks
      :kicker="page.risks.kicker"
      :title="page.risks.title"
      :lead="page.risks.lead"
      :punch="page.risks.punch"
      :groups="page.risks.groups"
    />

    <SectorShift
      :icon="page.icon"
      :eyebrow="page.band.eyebrow"
      :title="page.band.title"
      :statement="page.band.statement"
      :image="page.band.image"
      :image-alt="page.band.title"
      :before="{ label: page.whatChanges.from.label, statement: page.whatChanges.from.statement }"
      :after-label="page.whatChanges.toLabel"
      :items="shiftItems"
    />

    <SectorMetrics
      :kicker="page.indicators.kicker"
      :title="page.indicators.title"
      :source="page.indicators.source"
      :items="page.indicators.items"
    />

    <SectorRoles
      :kicker="page.impactByRole.kicker"
      :title="page.impactByRole.title"
      :icon="page.icon"
      :items="roleItems"
    />

    <SectorBrands
      :kicker="page.brands.kicker"
      :title="page.brands.title"
      :lead="page.brands.lead"
      :items="brandItems"
    />

    <FinalCta :data="page.finalCta" />
  </div>
</template>
