<script setup>
definePageMeta({ layout: 'admin', pageTransition: false })
defineI18nRoute(false)
useHead({ title: 'Sectores · Admin' })
</script>

<template>
  <CollectionEditor collection="sectors" title="Sectores" />
</template>
