<script setup>
definePageMeta({ layout: 'admin' })
defineI18nRoute(false)
useHead({ title: 'Marcas · Admin' })
</script>
<template>
  <h1>Marcas</h1>
  <div class="admin-card">
    Editor de <b>Pacífica · Trazatex · Operissa</b> (colección <code>brands</code>).
    Sigue el mismo patrón que <NuxtLink to="/admin/pages">Páginas</NuxtLink>: lista → editor por bloque
    (Zod + campos bilingües {es,en}) → guardar borrador → publicar. Pendiente de cablear al conectar Firebase.
  </div>
</template>
