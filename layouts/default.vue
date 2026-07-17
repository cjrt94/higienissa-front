<script setup>
const { locale } = useI18n()
const localeHead = useLocaleHead({ addSeoAttributes: true })
const { t } = useI18n()

useHead(() => ({
  htmlAttrs: { lang: localeHead.value.htmlAttrs?.lang || locale.value },
  link: [...(localeHead.value.link || [])],
  meta: [...(localeHead.value.meta || [])],
}))

// Datos estructurados JSON-LD (Organization + WebSite) — mismos en todas las páginas.
const settings = useSettings()
const site = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')
const sameAs = Object.values(settings.social || {}).filter((u) => u && u !== '#')
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site}/#organization`,
      name: 'Grupo Higienissa',
      url: `${site}/`,
      logo: `${site}/logos/lockup-horizontal-azul.png`,
      description: 'Ecosistema de higiene textil: lavandería industrial inteligente, trazabilidad RFID con data y operación especializada para salud, hotelería, industria y minería.',
      email: settings.contact?.email,
      areaServed: 'PE',
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      '@type': 'WebSite',
      '@id': `${site}/#website`,
      url: `${site}/`,
      name: 'Grupo Higienissa',
      publisher: { '@id': `${site}/#organization` },
      inLanguage: ['es', 'en'],
    },
  ],
}

useHead({
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }],
})
</script>

<template>
  <div>
    <a class="skip-link" href="#main">{{ t('a11y.skip') }}</a>
    <SiteHeader />
    <main id="main">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
