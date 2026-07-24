<script setup>
definePageMeta({ layout: 'admin', pageTransition: false })
defineI18nRoute(false)
useHead({ title: 'Marcas · Admin' })
</script>

<template>
  <CollectionEditor collection="brands" title="Marcas" />
</template>
