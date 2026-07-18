<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const open = ref(false)
const route = useRoute()
// cerrar el menú móvil al navegar
watch(() => route.fullPath, () => { open.value = false })

// Navbar transparente arriba SOLO en el home con el hero "flow" (fondo claro).
// Al scrollear (o abrir el menú móvil) vuelve el navy sólido.
const scrolled = ref(false)
const flowHero = computed(() => route.path === localePath('/') && route.query.hero === 'flow')
const isTransparent = computed(() => flowHero.value && !scrolled.value && !open.value)
const logoSrc = computed(() =>
  isTransparent.value ? '/logos/lockup-horizontal-azul.png' : '/logos/lockup-horizontal-blanco.png',
)
const onScroll = () => { scrolled.value = window.scrollY > 24 }
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

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
  <header class="site-header" :class="{ 'is-transparent': isTransparent }">
    <div class="container">
      <NuxtLink class="brand-logo" :to="localePath('/')" :aria-label="t('a11y.homeLink')">
        <img :src="logoSrc" alt="Grupo Higienissa">
      </NuxtLink>

      <button
        class="nav-toggle" :aria-label="t('nav.openMenu')" :aria-expanded="open"
        aria-controls="main-nav" @click="open = !open"
      >☰</button>

      <nav id="main-nav" class="main-nav" :class="{ open }" :aria-label="t('nav.mainNav')">
        <NuxtLink v-for="item in nav" :key="item.key" :to="localePath(item.to)">
          {{ t(`nav.${item.key}`) }}
        </NuxtLink>
        <NuxtLink class="nav-cta" :to="localePath('/contacto')">{{ t('nav.contact') }}</NuxtLink>
        <span class="lang-switch" :aria-label="t('nav.langSwitch')">
          <NuxtLink :to="switchLocalePath('es')" :class="{ active: $i18n.locale === 'es' }">ES</NuxtLink>
          <span class="sep">|</span>
          <NuxtLink :to="switchLocalePath('en')" :class="{ active: $i18n.locale === 'en' }">EN</NuxtLink>
        </span>
      </nav>
    </div>
  </header>
</template>
