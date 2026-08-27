<script setup>
// Botón flotante de WhatsApp, global en las páginas públicas (montado en layouts/default.vue).
// Lee el número de settings.contact.phone de forma SÍNCRONA vía useNuxtData (mismo patrón que
// ContactForm.vue): el layout ya resolvió el await de useSettings() antes de renderizar, así que
// el caché 'content:settings' está poblado en tiempo de render (SSR + cliente). Fallback duro por
// si el caché aún no llegó. Los textos (aria + saludo prellenado) van por i18n → viven en el build,
// no dependen de re-seed.
const { t } = useI18n()
const route = useRoute()
const { data: settings } = useNuxtData('content:settings')

const PHONE_FALLBACK = '920 539 648'
const digits = computed(() => String(settings.value?.contact?.phone || PHONE_FALLBACK).replace(/\D/g, ''))
const href = computed(() => `https://wa.me/51${digits.value}?text=${encodeURIComponent(t('contact.whatsappPrefill'))}`)

// Oculto en el back office (rutas /admin). Además, admin usa el layout 'admin' (sin este FAB),
// así que esto es una salvaguarda adicional.
const hidden = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <a
    v-if="!hidden"
    class="wa-fab"
    :href="href"
    target="_blank"
    rel="noopener"
    :aria-label="t('contact.whatsappAria')"
  >
    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  </a>
</template>

<style scoped>
.wa-fab {
  position: fixed;
  right: var(--fab-offset);
  bottom: var(--fab-offset);
  /* Alto pero por debajo de los modales (.modal-overlay = 900) y del toast (.toast-host = 1000) */
  z-index: 800;
  width: var(--fab-size);
  height: var(--fab-size);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #25D366; /* verde de marca WhatsApp */
  color: #fff;
  box-shadow: 0 10px 26px rgba(37, 211, 102, .34), 0 4px 12px rgba(15, 24, 54, .18);
  transition: background var(--dur) var(--ease-out), transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
}
.wa-fab:hover { background: #1EBE5A; transform: translateY(-2px); box-shadow: 0 14px 32px rgba(37, 211, 102, .42), 0 6px 14px rgba(15, 24, 54, .2); }
.wa-fab:active { transform: translateY(0) scale(.97); }
.wa-fab:focus-visible { outline: var(--focus-ring); outline-offset: var(--focus-offset); }
.wa-fab svg { width: 30px; height: 30px; display: block; }

/* Entrada suave; fill-mode backwards libera el transform al terminar → el hover sigue funcionando.
   Solo cuando el usuario no pidió reducir movimiento. */
@media (prefers-reduced-motion: no-preference) {
  .wa-fab { animation: wa-fab-in .4s var(--ease-out) backwards; }
}
@keyframes wa-fab-in {
  from { opacity: 0; transform: translateY(12px) scale(.85); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
