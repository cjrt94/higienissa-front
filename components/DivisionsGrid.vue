<script setup>
defineProps({ data: { type: Object, required: true } })
const t = useT()
const localePath = useLocalePath()
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
            <span v-if="item.logo" class="card-brand"><img :src="item.logo" :alt="item.name" loading="lazy" decoding="async"></span>
            <h3 v-else>{{ item.name }}</h3>
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
/* Logo de la marca en reemplazo del nombre y del eyebrow (ampliado) */
.card-brand { align-self: flex-start; display: inline-flex; margin-bottom: var(--space-1); }
.card-brand img { height: auto; max-height: 72px; max-width: 210px; width: auto; object-fit: contain; display: block; }

/* Card completo clickeable (stretched link): el enlace "Ver más" se mantiene como
   única <a> (accesible) y su ::after se estira sobre todo el card. */
.card { position: relative; cursor: pointer; }
.card .link-arrow::after { content: ""; position: absolute; inset: 0; z-index: 1; }
.card:has(.link-arrow:focus-visible) { outline: 2px solid var(--azul); outline-offset: 2px; }
</style>
