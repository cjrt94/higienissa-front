<script setup>
const { locale } = useI18n()
const localeHead = useLocaleHead({ addSeoAttributes: true })
const { t } = useI18n()
const site = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')

// Settings se resuelve con await (Firestore/semilla). Registramos un useHead reactivo ANTES
// del await para no perder el contexto de instancia; el JSON-LD entra cuando settings resuelve
// (en SSR el head se serializa tras completar el setup, así que ya está poblado).
const settings = ref(null)

useHead(() => {
  const head = {
    htmlAttrs: { lang: localeHead.value.htmlAttrs?.lang || locale.value },
    link: [...(localeHead.value.link || [])],
    meta: [...(localeHead.value.meta || [])],
  }
  if (settings.value) {
    const sameAs = Object.values(settings.value.social || {}).filter((u) => u && u !== '#')
    head.script = [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${site}/#organization`,
            name: 'Grupo Higienissa',
            url: `${site}/`,
            logo: `${site}/logos/lockup-horizontal-azul.png`,
            description: 'Ecosistema de higiene textil: lavandería industrial inteligente, trazabilidad RFID con data y operación especializada para salud, hotelería, industria y minería.',
            email: settings.value.contact?.email,
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
      }),
    }]
  }
  return head
})

settings.value = await useSettings()
</script>

<template>
  <div>
    <a class="skip-link" href="#main">{{ t('a11y.skip') }}</a>
    <SiteHeader />
    <main id="main">
      <slot />
    </main>
    <SiteFooter />
    <ClientOnly><ToastHost /></ClientOnly>
  </div>
</template>
