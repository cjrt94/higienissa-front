<script setup>
definePageMeta({ layout: 'admin' })
defineI18nRoute(false)
useHead({ title: 'Blog · Admin' })
</script>
<template>
  <h1>Blog</h1>
  <div class="admin-card">
    Artículos y categorías (colecciones <code>posts</code> / <code>postCategories</code>), con slug por idioma
    y summary denormalizado (Cloud Function). Mismo patrón de editor que <NuxtLink to="/admin/pages">Páginas</NuxtLink>.
  </div>
</template>
