<script setup>
definePageMeta({ layout: 'admin' })
defineI18nRoute(false)
useHead({ title: 'Sectores · Admin' })
</script>

<template>
  <CollectionEditor collection="sectors" title="Sectores" />
</template>
