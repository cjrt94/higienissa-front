<script setup>
const { t } = useI18n()
const ui = useUiText()
const localePath = useLocalePath()
const settings = await useSettings()

const brandsCol = [
  { to: '/marca-pacifica', key: 'pacifica' },
  { to: '/marca-trazatex', key: 'trazatex' },
  { to: '/marca-operissa', key: 'operissa' },
]
const sectorsCol = [
  { to: '/sector-salud', key: 'salud' },
  { to: '/sector-hoteleria', key: 'hoteleria' },
  { to: '/sector-industria', key: 'industria' },
  { to: '/sector-mineria', key: 'mineria' },
]
const companyCol = [
  { to: '/institucional', key: 'about' },
  { to: '/recursos', key: 'resources' },
  { to: '/contacto', key: 'contact' },
]

// Redes: URL desde settings.social (compat JSON-LD), label editable en settings.socialLabels.
const SOCIAL = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'youtube', label: 'YouTube' },
]
const socialLinks = computed(() => SOCIAL.map((s) => ({
  key: s.key,
  label: settings.socialLabels?.[s.key] || s.label,
  url: settings.social?.[s.key] || '#',
})))
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img :src="settings.brand?.logoWhite || '/logos/lockup-horizontal-blanco.png'" width="192" height="46" :alt="settings.brand?.name || 'Grupo Higienissa'">
          <p>{{ ui('tagline') }}</p>
          <div class="footer-social" :aria-label="t('footer.social')">
            <a v-for="s in socialLinks" :key="s.key" :href="s.url" :aria-label="s.label">{{ s.label }}</a>
          </div>
        </div>

        <div>
          <h3>{{ t('footer.ecosystem') }}</h3>
          <ul>
            <li v-for="i in brandsCol" :key="i.key">
              <NuxtLink :to="localePath(i.to)">{{ t(`nav.${i.key}`) }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3>{{ t('footer.sectors') }}</h3>
          <ul>
            <li v-for="i in sectorsCol" :key="i.key">
              <NuxtLink :to="localePath(i.to)">{{ t(`sectors.${i.key}`) }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3>{{ t('footer.company') }}</h3>
          <ul>
            <li v-for="i in companyCol" :key="i.key">
              <NuxtLink :to="localePath(i.to)">{{ t(`nav.${i.key}`) }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3>{{ t('footer.contact') }}</h3>
          <ul>
            <li><a :href="`mailto:${settings.contact.email}`">{{ settings.contact.email }}</a></li>
          </ul>
          <p class="muted">
            {{ t('footer.asisNote', { partner: settings.asisStrip.partnerName }) }}
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <span>{{ t('footer.rights') }}</span>
        <span class="footer-legal">
          <NuxtLink :to="localePath('/aviso-legal')">{{ t('footer.legalNotice') }}</NuxtLink>
          <NuxtLink :to="localePath('/privacidad')">{{ t('footer.privacy') }}</NuxtLink>
        </span>
      </div>
    </div>
  </footer>
</template>
