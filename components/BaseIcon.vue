<script setup>
// Íconos SVG inline (stroke). NUNCA emoji, nunca isotipo tileado.
const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
  // Si se pasa `label`, el ícono deja de ser decorativo y expone nombre accesible
  // (para íconos que son el único contenido de un control). Sin label = aria-hidden.
  label: { type: String, default: '' },
  strokeWidth: { type: [Number, String], default: 1.6 },
})
const paths = {
  droplet: '<path d="M12 3s6 6.2 6 10.2a6 6 0 0 1-12 0C6 9.2 12 3 12 3z"/><path d="M9.5 13a2.5 2.5 0 0 0 2.5 2.5"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>',
  shield: '<path d="M12 3l7 3v5c0 4.2-3 7.3-7 8.5-4-1.2-7-4.3-7-8.5V6l7-3z"/><path d="M9 11.5l2.2 2.2L15.5 9.5"/>',
  activity: '<path d="M12 21a9 9 0 1 0-9-9"/><path d="M3 12h4l2 5 3-10 2 5h4"/>',
  chart: '<path d="M4 19V5"/><path d="M4 19h16"/><rect x="7" y="11" width="3" height="5"/><rect x="12" y="8" width="3" height="8"/><path d="M17 16V9"/>',
  scan: '<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 7V5.5A1.5 1.5 0 0 1 8.5 4h7A1.5 1.5 0 0 1 17 5.5V7"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
  close: '<path d="M18 6L6 18M6 6l12 12"/>',
  hotel: '<path d="M3 21h18"/><path d="M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16"/><path d="M15 21V9h4a1 1 0 0 1 1 1v11"/><path d="M8 8h2M8 12h2M8 16h2"/>',
  mountain: '<path d="M3 20h18L14.5 7.5l-3 4.8-2-2.6L3 20z"/><circle cx="17" cy="6" r="1.4"/>',
}
const inner = computed(() => paths[props.name] || '')
const dim = computed(() => `${parseInt(props.size, 10) || 24}px`)
</script>

<template>
  <svg
    :style="{ width: dim, height: dim }" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round"
    :role="label ? 'img' : undefined" :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'" v-html="inner"
  />
</template>
