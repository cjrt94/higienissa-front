<script setup>
definePageMeta({ layout: 'admin' })
defineI18nRoute(false)
useHead({ title: 'Panel · Higienissa Admin' })

const shortcuts = [
  { to: '/admin/pages', label: 'Páginas', desc: 'Home y páginas institucionales' },
  { to: '/admin/brands', label: 'Marcas', desc: 'Pacífica · Trazatex · Operissa' },
  { to: '/admin/sectors', label: 'Sectores', desc: 'Salud · Hotelería · Industria · Minería' },
  { to: '/admin/posts', label: 'Blog', desc: 'Artículos y categorías' },
  { to: '/admin/submissions', label: 'Contactos', desc: 'Solicitudes del formulario' },
]
</script>

<template>
  <h1>Panel</h1>
  <div class="grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">
    <NuxtLink v-for="s in shortcuts" :key="s.to" :to="s.to" class="admin-card" style="text-decoration:none;color:inherit">
      <b style="display:block;margin-bottom:4px">{{ s.label }}</b>
      <small style="color:#7a8190">{{ s.desc }}</small>
    </NuxtLink>
  </div>
</template>
