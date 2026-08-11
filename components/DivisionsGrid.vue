<script setup>
defineProps({
  data: { type: Object, required: true },
  // Encabezado de la sección "Tres marcas, una misma visión" (antes vivía en
  // GroupIntro): título + lead centrados que ahora encabezan directamente las 3 marcas.
  intro: { type: Object, default: null },
})
const t = useT()
const localePath = useLocalePath()
</script>

<template>
  <section id="ecosistema" class="section">
    <div class="container">
      <!-- Sección unificada (pedido cliente): el encabezado "Tres marcas, una misma
           visión" + lead encabeza directamente las 3 marcas, sin los highlight cards
           intermedios (Una sola interlocución / Un mismo estándar / Decisiones con datos). -->
      <div v-if="intro" class="section-head center intro-centered">
        <span v-if="t(intro.eyebrow)" class="kicker">{{ t(intro.eyebrow) }}</span>
        <h2 v-if="t(intro.title)">{{ t(intro.title) }}</h2>
        <p v-if="t(intro.lead)" class="lead">{{ t(intro.lead) }}</p>
      </div>
      <div v-else-if="t(data.eyebrow) || t(data.title)" class="section-head center">
        <span v-if="t(data.eyebrow)" class="kicker">{{ t(data.eyebrow) }}</span>
        <h2 v-if="t(data.title)">{{ t(data.title) }}</h2>
      </div>

      <div class="grid cols-3 reveal stagger" :style="intro ? 'margin-top:var(--space-7)' : null">
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
/* El lead de la intro es largo: ancho de lectura cómodo (el .section-head base lo limita a 60ch). */
.intro-centered { max-width: 72ch; }
.intro-centered .lead { max-width: 66ch; }

/* Logo de la marca en reemplazo del nombre y del eyebrow (ampliado) */
.card-brand { align-self: flex-start; display: inline-flex; margin-bottom: var(--space-1); }
.card-brand img { height: auto; max-height: 72px; max-width: 210px; width: auto; object-fit: contain; display: block; }

/* Card completo clickeable (stretched link): el enlace "Ver más" se mantiene como
   única <a> (accesible) y su ::after se estira sobre todo el card. */
.card { position: relative; cursor: pointer; }
.card .link-arrow::after { content: ""; position: absolute; inset: 0; z-index: 1; }
.card:has(.link-arrow:focus-visible) { outline: 2px solid var(--azul); outline-offset: 2px; }
</style>
