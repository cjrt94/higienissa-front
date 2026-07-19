// ═══════════════════════════════════════════════════════════════════════════
// PREVIEW DE HEROS — FEATURE TEMPORAL (fácil de quitar)
//
// Switcher SIEMPRE visible en la home para alternar entre variantes del hero
// (Actual / Flujo / Kinético). También se puede fijar por URL con
// ?hero=flow|kinetic|actual (útil para compartir un link).
//
// La elección se MANTIENE mientras se navega entre páginas (estado en memoria)
// y vuelve al hero POR DEFECTO al recargar la home → el default nunca queda
// "cambiado" de forma permanente para el visitante.
//
// El render lo hace pages/index.vue con <HeroFlow/HeroKinetic/HeroHome v-if…>
// según `activeOption` (evita resolveComponent, que fallaba y dejaba el hero vacío).
//
// ─────────────────────────── CÓMO QUITAR EL FEATURE ───────────────────────────
//   1. Borrar este archivo (composables/useHeroPreview.js).
//   2. En pages/index.vue borrar los bloques marcados «HERO PREVIEW» del <script>,
//      del <template> y los estilos .hero-switcher, y dejar el hero fijo:
//          <HeroHome :data="page.hero" />
// ═══════════════════════════════════════════════════════════════════════════
const VARIANTS = ['flow', 'kinetic'] // variantes reales (aparte de "actual")

export function useHeroPreview() {
  const route = useRoute()

  // Selección compartida en memoria: sobrevive la navegación SPA entre páginas y se
  // resetea al recargar (un fresh load de la home = hero por defecto).
  const selected = useState('hero-preview', () => '')

  // Descarta el valor persistente de la versión anterior (localStorage), que hacía
  // que el hero por defecto pareciera cambiado al volver a la home.
  onMounted(() => {
    try { localStorage.removeItem('hh-hero-preview') } catch (e) { /* noop */ }
  })

  // ?hero= en la URL actualiza la selección (flow/kinetic → variante; actual → default).
  const queryHero = computed(() => {
    const q = route.query.hero
    if (q == null) return null
    return VARIANTS.includes(q) ? q : 'actual'
  })
  watch(queryHero, (h) => {
    if (h == null) return
    selected.value = h === 'actual' ? '' : h
  }, { immediate: true })

  const options = [
    { key: 'actual', label: 'Actual' },
    { key: 'flow', label: 'Flujo' },
    { key: 'kinetic', label: 'Kinético' },
  ]
  // Variante activa: '' (default) se representa como 'actual'.
  const activeOption = computed(() => selected.value || 'actual')

  return { options, activeOption }
}
