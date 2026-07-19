<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const open = ref(false)
const route = useRoute()
const toggleEl = ref(null)
// cerrar el menú móvil al navegar
watch(() => route.fullPath, () => { open.value = false })

// Navbar transparente arriba. Por defecto los heros son de fondo claro:
// texto oscuro + logo de color. Las páginas cuyo primer hero es una FOTO OSCURA a
// sangre (p. ej. sectores industria/minería/hotelería) declaran `definePageMeta({ darkHero: true })`
// y entonces, mientras el navbar está transparente, usamos logo blanco + texto/links
// blancos para conservar el contraste AA sobre la imagen. Al scrollear (>24px) o abrir
// el menú móvil vuelve el navy sólido con sombra (logo blanco, ya legible).
const scrolled = ref(false)
const isTransparent = computed(() => !scrolled.value && !open.value)
// Señal por página: SiteHeader lee route.meta.darkHero (reactivo y se resetea al navegar).
const darkHero = computed(() => route.meta.darkHero === true)
const isDarkHero = computed(() => isTransparent.value && darkHero.value)
const logoSrc = computed(() =>
  isTransparent.value && !darkHero.value
    ? '/logos/lockup-horizontal-azul.png'
    : '/logos/lockup-horizontal-blanco.png',
)
const onScroll = () => { scrolled.value = window.scrollY > 24 }

// Menú móvil: bloquear scroll del body y cerrar con Esc; al cerrar devolver el foco al botón.
watch(open, (v) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = v ? 'hidden' : ''
  if (!v && toggleEl.value) toggleEl.value.focus()
})
const onKeydown = (e) => { if (e.key === 'Escape' && open.value) open.value = false }

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})

const nav = [
  { to: '/', key: 'home' },
  { to: '/marca-pacifica', key: 'pacifica' },
  { to: '/marca-trazatex', key: 'trazatex' },
  { to: '/marca-operissa', key: 'operissa' },
  { to: '/institucional', key: 'about' },
  { to: '/recursos', key: 'resources' },
]
</script>

<template>
  <header class="site-header" :class="{ 'is-transparent': isTransparent, 'is-scrolled': scrolled, 'is-dark-hero': isDarkHero }">
    <div class="container">
      <NuxtLink class="brand-logo" :to="localePath('/')" :aria-label="t('a11y.homeLink')">
        <img :src="logoSrc" width="167" height="40" alt="Grupo Higienissa">
      </NuxtLink>

      <button
        ref="toggleEl"
        class="nav-toggle" :aria-label="open ? t('nav.closeMenu') : t('nav.openMenu')" :aria-expanded="open"
        aria-controls="main-nav" @click="open = !open"
      >
        <BaseIcon :name="open ? 'close' : 'menu'" :size="22" />
      </button>

      <!-- Fondo oscuro tras el panel en móvil; clic para cerrar -->
      <div v-if="open" class="nav-scrim" @click="open = false" />

      <nav id="main-nav" class="main-nav" :class="{ open }" :aria-label="t('nav.mainNav')">
        <NuxtLink v-for="item in nav" :key="item.key" :to="localePath(item.to)">
          {{ t(`nav.${item.key}`) }}
        </NuxtLink>
        <NuxtLink class="nav-cta" :to="localePath('/contacto')">{{ t('nav.contact') }}</NuxtLink>
        <span class="lang-switch" role="group" :aria-label="t('nav.langSwitch')">
          <NuxtLink :to="switchLocalePath('es')" :class="{ active: $i18n.locale === 'es' }">ES</NuxtLink>
          <span class="sep" aria-hidden="true">|</span>
          <NuxtLink :to="switchLocalePath('en')" :class="{ active: $i18n.locale === 'en' }">EN</NuxtLink>
        </span>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* Modo "hero oscuro": mientras el navbar está transparente sobre una foto oscura a
   sangre, invertimos el nav a blanco. Selectores con .is-dark-hero.is-transparent para
   ganarle en especificidad a las reglas .is-transparent de site.css (fondo claro). */
.site-header.is-dark-hero.is-transparent .main-nav > a { color: rgba(255, 255, 255, .9); }
.site-header.is-dark-hero.is-transparent .main-nav > a:hover { color: #fff; background: rgba(255, 255, 255, .12); }
.site-header.is-dark-hero.is-transparent .main-nav > a[aria-current="page"] { color: #fff; background: rgba(255, 255, 255, .16); }
.site-header.is-dark-hero.is-transparent .lang-switch a { color: rgba(255, 255, 255, .72); }
.site-header.is-dark-hero.is-transparent .lang-switch a.active,
.site-header.is-dark-hero.is-transparent .lang-switch a[aria-current="true"] { color: #fff; }
.site-header.is-dark-hero.is-transparent .lang-switch .sep { color: rgba(255, 255, 255, .4); }
.site-header.is-dark-hero.is-transparent .nav-toggle { color: #fff; border-color: rgba(255, 255, 255, .42); }

/* Touch target del botón hamburguesa ≥44px (WCAG 2.5.5). Solo afecta al móvil: en
   escritorio el toggle está oculto. box-sizing:border-box para respetar el padding/borde. */
.nav-toggle { min-width: 44px; min-height: 44px; box-sizing: border-box; }
</style>
