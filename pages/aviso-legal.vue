<script setup>
const page = await useLegalContent('aviso-legal')
const t = useT()
const settings = await useSettings()

// Atribución de imágenes de terceros con licencia CC (obligatoria) — vive aquí, al
// final del aviso legal, no en el footer global. LegalDoc la renderiza como sección
// final y la incluye en el índice.
const imageCredits = settings.imageCredits || []

// Mientras el documento conserve placeholders [ASÍ] (datos legales sin completar:
// razón social, RUC, domicilio, distrito judicial), la página está en borrador y
// NO debe indexarse. Al reemplazarlos por los datos reales, el noindex desaparece
// solo. Ver reporte de Rowena, punto 1.
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
  <LegalDoc :page="page" :credits="imageCredits" />
</template>
