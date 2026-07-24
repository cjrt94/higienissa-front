<script setup>
definePageMeta({ layout: 'admin' })
defineI18nRoute(false)
useHead({ title: 'Marcas · Admin' })
</script>

<template>
  <CollectionEditor collection="brands" title="Marcas" />
</template>
