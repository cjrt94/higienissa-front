<script setup>
// Botón/enlace. `to` = ruta interna (se localiza con localePath). `href` = ancla o externo.
const props = defineProps({
  to: { type: String, default: '' },
  href: { type: String, default: '' },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'ghost', 'light'].includes(v),
  },
  disabled: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '' }, // para botones que solo llevan ícono
})
const localePath = useLocalePath()
const cls = computed(() => [`btn-${props.variant}`, { 'is-disabled': props.disabled }])
// href externo → abre en pestaña nueva con rel seguro
const isExternal = computed(() => /^https?:\/\//.test(props.href))
const extAttrs = computed(() =>
  isExternal.value ? { target: '_blank', rel: 'noopener noreferrer' } : {},
)
</script>

<template>
  <NuxtLink
    v-if="to" :to="localePath(to)" :class="cls"
    :aria-label="ariaLabel || undefined" :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
  ><slot /></NuxtLink>
  <a
    v-else :href="href" :class="cls" v-bind="extAttrs"
    :aria-label="ariaLabel || undefined" :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
  ><slot /></a>
</template>
