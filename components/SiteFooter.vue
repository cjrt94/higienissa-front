<script setup>
const { t } = useI18n()
const tt = useT()
const localePath = useLocalePath()
const settings = useSettings()

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
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="/logos/lockup-horizontal-blanco.png" alt="Grupo Higienissa">
          <p>{{ t('tagline') }}</p>
          <div class="footer-social" :aria-label="t('footer.social')">
            <a :href="settings.social.linkedin" aria-label="LinkedIn">LinkedIn</a>
            <a :href="settings.social.instagram" aria-label="Instagram">Instagram</a>
            <a :href="settings.social.youtube" aria-label="YouTube">YouTube</a>
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
            <li>{{ settings.contact.phone }}</li>
            <li>{{ tt(settings.contact.city) }}</li>
          </ul>
          <p class="muted">
            {{ t('footer.asisNote', { partner: settings.asisStrip.partnerName }) }}
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <span>{{ t('footer.rights') }}</span>
        <span>
          <NuxtLink :to="localePath('/aviso-legal')">{{ t('footer.legalNotice') }}</NuxtLink> ·
          <NuxtLink :to="localePath('/privacidad')">{{ t('footer.privacy') }}</NuxtLink> ·
          <NuxtLink :to="localePath('/creditos')">{{ t('footer.credits') }}</NuxtLink>
        </span>
      </div>
    </div>
  </footer>
</template>
