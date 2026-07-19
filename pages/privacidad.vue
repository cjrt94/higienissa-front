<script setup>
const page = useLegalContent('privacidad')
const t = useT()

// Mientras el documento conserve placeholders [ASÍ] (email legal/DPO, responsable,
// razón social, RUC... sin completar), la política está en borrador y NO debe
// indexarse: el visitante no podría ejercer sus derechos ARCO. Al reemplazarlos por
// los datos reales, el noindex desaparece solo. Ver reporte de Rowena, punto 1.
const isDraft = /\[[^\]]+\]/.test(JSON.stringify(page.sections))

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
  ogType: 'website',
  robots: isDraft ? 'noindex, nofollow' : undefined,
})
</script>

<template>
  <LegalDoc :page="page" />
</template>
