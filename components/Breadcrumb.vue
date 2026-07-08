<script setup>
// items: [{ label: 'Inicio', to: '/' }, { label: 'Marca' }]  — el último sin `to`.
defineProps({ items: { type: Array, default: () => [] } })
const localePath = useLocalePath()
</script>

<template>
  <nav class="breadcrumb" aria-label="Migas de pan">
    <ol>
      <li v-for="(it, i) in items" :key="i">
        <NuxtLink v-if="it.to && i < items.length - 1" :to="localePath(it.to)">{{ it.label }}</NuxtLink>
        <span v-else aria-current="page">{{ it.label }}</span>
      </li>
    </ol>
  </nav>
</template>
