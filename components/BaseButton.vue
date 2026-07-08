<script setup>
// Botón/enlace. `to` = ruta interna (se localiza con localePath). `href` = ancla o externo.
const props = defineProps({
  to: { type: String, default: '' },
  href: { type: String, default: '' },
  variant: { type: String, default: 'primary' }, // primary | ghost | light
})
const localePath = useLocalePath()
const cls = computed(() => `btn-${props.variant}`)
</script>

<template>
  <NuxtLink v-if="to" :to="localePath(to)" :class="cls"><slot /></NuxtLink>
  <a v-else :href="href" :class="cls"><slot /></a>
</template>
