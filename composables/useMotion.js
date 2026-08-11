// Wrapper único para animaciones GSAP. Garantiza, en una sola llamada:
//   · client-only (el plugin gsap.client sólo provee $gsap en cliente)
//   · scoping de selectores al contenedor del componente (sin colisión entre instancias)
//   · prefers-reduced-motion: la animación SOLO se construye bajo `no-preference`
//     (la red de seguridad CSS global NO frena animaciones JS de GSAP, así que esto es
//      la única garantía). Con `reduce` no se crea nada → queda el estado final del DOM.
//   · cleanup en unmount (mata tweens + ScrollTriggers del scope) — clave con la
//     page-transition out-in, que monta/desmonta páginas.
//
// Uso en <script setup>:
//   const root = ref(null)                        // ref a la raíz del componente
//   useGsapContext(root, ({ gsap, ScrollTrigger }) => { ... })   // selectores relativos a root
//
// `gsap.matchMedia(scope)` cubre a la vez el gate de reduced-motion, el scoping de
// selectores y el teardown (mm.revert()).
export function useGsapContext(scopeRef, build) {
  const { $gsap } = useNuxtApp() // undefined en SSR (plugin .client)
  let mm
  onMounted(() => {
    if (!import.meta.client || !$gsap) return
    // No se toca la clase `gsap-ready`: el pre-hide CSS (html.js:not(.gsap-ready) .anim-in)
    // lo sobreescriben los estilos inline de GSAP por especificidad, así que no hay que
    // retirarlo aquí (hacerlo antes del primer tick de GSAP provocaría un flash). El
    // `gsap-ready` se añade solo por el failsafe con timeout en el <head> (si GSAP no cargara).
    const { gsap, ScrollTrigger } = $gsap
    mm = gsap.matchMedia(scopeRef.value || undefined)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      build({ gsap, ScrollTrigger })
    })
  })
  onBeforeUnmount(() => mm && mm.revert())
}
