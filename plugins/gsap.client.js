// GSAP — solo cliente (nunca entra al prerender/SSR). Registra ScrollTrigger una vez,
// fija defaults alineados a los tokens de motion del proyecto (~.6s, ease de entrada) y
// reetiqueta posiciones de scroll tras cada navegación (convive con la page-transition
// fade out-in y con imágenes lazy). Expone { gsap, ScrollTrigger } como $gsap.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger)
  gsap.defaults({ ease: 'power3.out', duration: 0.6 })

  // Tras navegar (y tras el doble rAF que ya usa el reveal), recalcular start/end.
  nuxtApp.hook('page:finish', () => {
    requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()))
  })

  return { provide: { gsap: { gsap, ScrollTrigger } } }
})
