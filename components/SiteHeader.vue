<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const open = ref(false)
const route = useRoute()
const toggleEl = ref(null)
// cerrar el menú móvil al navegar
watch(() => route.fullPath, () => { open.value = false })

// Navbar transparente arriba SOLO en el home con el hero "flow"/"kinetic" (fondo claro).
// Al scrollear (o abrir el menú móvil) vuelve el navy sólido.
const scrolled = ref(false)
const flowHero = computed(() => route.path === localePath('/') && ['flow', 'kinetic'].includes(route.query.hero))
const isTransparent = computed(() => flowHero.value && !scrolled.value && !open.value)
const logoSrc = computed(() =>
  isTransparent.value ? '/logos/lockup-horizontal-azul.png' : '/logos/lockup-horizontal-blanco.png',
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
  <header class="site-header" :class="{ 'is-transparent': isTransparent, 'is-scrolled': scrolled }">
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
