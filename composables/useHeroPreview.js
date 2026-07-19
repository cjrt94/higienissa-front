// ═══════════════════════════════════════════════════════════════════════════
// PREVIEW DE HEROS — FEATURE TEMPORAL (fácil de quitar)
//
// Permite ver variantes del hero de la home vía ?hero=flow|kinetic|actual y
// muestra un switcher flotante. La elección se PERSISTE en localStorage para que
// se mantenga al navegar entre páginas y al recargar (solo en modo preview;
// "Actual" lo resetea). Los visitantes normales —que nunca entraron con ?hero=—
// ven el hero por defecto y NO ven el switcher.
//
// ─────────────────────────── CÓMO QUITAR EL FEATURE ───────────────────────────
//   1. Borrar este archivo (composables/useHeroPreview.js).
//   2. En pages/index.vue borrar los bloques marcados «HERO PREVIEW» del <script>,
//      del <template> y los estilos .hero-switcher, y dejar el hero fijo:
//          <HeroHome :data="page.hero" />
// ═══════════════════════════════════════════════════════════════════════════
const STORAGE_KEY = 'hh-hero-preview'
const VARIANTS = ['flow', 'kinetic'] // variantes reales (aparte de "actual")

export function useHeroPreview() {
  const route = useRoute()

  // resolveComponent porque <component :is="string"> no lo resuelve el auto-import.
  const components = {
    '': resolveComponent('HeroHome'),
    flow: resolveComponent('HeroFlow'),
    kinetic: resolveComponent('HeroKinetic'),
  }

  // Elección guardada (solo cliente; null en SSR/prerender).
  const stored = ref(null)
  onMounted(() => { stored.value = localStorage.getItem(STORAGE_KEY) })

  // Lo que pide la URL: 'flow'/'kinetic' → esa variante; 'actual' → reset; nada → null.
  const queryHero = computed(() => {
    const q = route.query.hero
    if (q == null) return null
    return VARIANTS.includes(q) ? q : 'actual'
  })

  // Persistir cuando llega por URL (guardar variante o limpiar si es "actual").
  watch(queryHero, (h) => {
    if (h == null || typeof localStorage === 'undefined') return
    if (h === 'actual') {
      localStorage.removeItem(STORAGE_KEY)
      stored.value = null
    } else {
      localStorage.setItem(STORAGE_KEY, h)
      stored.value = h
    }
  }, { immediate: true })

  // Variante activa: manda la URL; si no trae, la guardada; si no, hero por defecto.
  const activeKey = computed(() => queryHero.value ?? stored.value ?? '')
  const heroComponent = computed(() => components[activeKey.value] || components[''])

  // Mostrar el switcher si viene por URL o si hay algo guardado (seguimos en preview).
  const previewMode = computed(() => route.query.hero != null || !!stored.value)

  const options = [
    { key: 'actual', label: 'Actual' },
    { key: 'flow', label: 'Flujo' },
    { key: 'kinetic', label: 'Kinético' },
  ]
  // Para resaltar el botón activo: '' (default) se muestra como 'actual'.
  const activeOption = computed(() => activeKey.value || 'actual')

  return { heroComponent, previewMode, options, activeOption }
}
