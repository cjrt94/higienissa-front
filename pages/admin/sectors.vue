<script setup>
definePageMeta({ layout: 'admin' })
defineI18nRoute(false)
useHead({ title: 'Sectores · Admin' })
</script>
<template>
  <h1>Sectores</h1>
  <div class="admin-card">
    Editor de <b>Salud · Hotelería · Industria · Minería</b> (colección <code>sectors</code>).
    Mismo patrón que <NuxtLink to="/admin/pages">Páginas</NuxtLink>.
  </div>
</template>
