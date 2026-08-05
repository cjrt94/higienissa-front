<script setup>
defineProps({ data: { type: Object, required: true } })
const t = useT()
const localePath = useLocalePath()
// Mismo lenguaje de íconos por marca que el hero (Pacífica=lavado, Trazatex=RFID, Operissa=operación)
const iconFor = (to = '') =>
  to.includes('trazatex') ? 'scan' : to.includes('operissa') ? 'cog' : 'droplet'
</script>

<template>
  <section id="ecosistema" class="section">
    <div class="container">
      <div v-if="t(data.eyebrow) || t(data.title)" class="section-head center">
        <span v-if="t(data.eyebrow)" class="kicker">{{ t(data.eyebrow) }}</span>
        <h2 v-if="t(data.title)">{{ t(data.title) }}</h2>
      </div>
      <div class="grid cols-3 reveal stagger">
        <article v-for="item in data.items" :key="item.name" class="card">
          <div class="card-media">
            <img :src="item.image" :alt="t(item.imageAlt)" width="800" height="500" loading="lazy" decoding="async">
          </div>
          <div class="card-body">
            <span class="card-eyebrow-row">
              <span v-if="item.logo" class="card-logo"><img :src="item.logo" :alt="item.name" loading="lazy" decoding="async"></span>
              <span v-else class="card-ico"><BaseIcon :name="iconFor(item.to)" :size="18" /></span>
              <span class="card-eyebrow">{{ t(item.eyebrow) }}</span>
            </span>
            <h3>{{ item.name }}</h3>
            <p class="card-desc">{{ t(item.desc) }}</p>
            <NuxtLink class="link-arrow" :to="localePath(item.to)">
              {{ $t('cta.viewMore') }}
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Logo real de la marca sobre chip claro (mismo tratamiento que el hero) */
.card-logo { display: inline-flex; align-items: center; justify-content: center; height: 30px; padding: 4px 10px; background: #fff; border: 1px solid var(--line); border-radius: 8px; }
.card-logo img { height: 100%; max-height: 22px; width: auto; max-width: 92px; object-fit: contain; display: block; }
</style>
