<script setup>
defineProps({ data: { type: Object, required: true } })
const t = useT()
</script>

<template>
  <section class="section section-alt">
    <div class="container">
      <!-- Centrado (pedido cliente): título "Tres marcas, una misma visión" + lead centrados,
           con los highlights y las marcas (DivisionsGrid) justo debajo. Sin foto lateral. -->
      <div class="section-head center intro-centered">
        <span class="kicker">{{ t(data.eyebrow) }}</span>
        <h2>{{ t(data.title) }}</h2>
        <p class="lead">{{ t(data.lead) }}</p>
      </div>

      <div class="grid cols-3 reveal" style="margin-top:var(--space-7)" :aria-label="t(data.eyebrow)">
        <div v-for="(h, i) in data.highlights" :key="i" class="highlight">
          <span class="h-icon"><BaseIcon :name="h.icon" :size="22" /></span>
          <span>
            <span class="h-label">{{ t(h.label) }}</span>
            <p>{{ t(h.text) }}</p>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Bloque de intro centrado: el lead es largo, se le da un ancho de lectura cómodo
   sin dejarlo demasiado angosto/alto (el .section-head base lo limita a 60ch). */
.intro-centered { max-width: 72ch; }
.intro-centered .lead { max-width: 66ch; }
</style>
