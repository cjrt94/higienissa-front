<script setup>
const { locale } = useI18n()
const localeHead = useLocaleHead({ addSeoAttributes: true })
const { t } = useI18n()

useHead(() => ({
  htmlAttrs: { lang: localeHead.value.htmlAttrs?.lang || locale.value },
  link: [...(localeHead.value.link || [])],
  meta: [...(localeHead.value.meta || [])],
}))
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
