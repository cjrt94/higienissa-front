// Reveal-on-scroll progresivo. Revela de inmediato lo que ya está en viewport (robusto: no
// depende de que IntersectionObserver "dispare" para contenido above-the-fold) y observa el resto.
// Sin JS o con reduced-motion, el contenido queda visible (site.css no lo oculta).
export default defineNuxtPlugin((nuxtApp) => {
  const arm = () => {
    const els = document.querySelectorAll('.reveal:not(.reveal-armed)')
    if (!els.length) return
    const hasIO = 'IntersectionObserver' in window
    const vh = window.innerHeight || 800
    const io = hasIO
      ? new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target) }
          })
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 })
      : null
    els.forEach((el) => {
      el.classList.add('reveal-armed')
      const top = el.getBoundingClientRect().top
      if (!hasIO || top < vh * 0.95) el.classList.add('in') // ya visible → revelar ya
      else io.observe(el)
    })
  }
  const deferArm = () => requestAnimationFrame(() => requestAnimationFrame(arm))
  nuxtApp.hook('app:suspense:resolve', deferArm)
  nuxtApp.hook('page:finish', deferArm)
})
