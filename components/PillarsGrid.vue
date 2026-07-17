<script setup>
defineProps({ data: { type: Object, required: true } })
const t = useT()
</script>

<template>
  <section class="section section-alt">
    <div class="container">
      <div class="section-head center">
        <span class="kicker">{{ t(data.eyebrow) }}</span>
        <h2>{{ t(data.title) }}</h2>
      </div>
      <!-- Columnas editoriales (no cards): rompe el eco visual con los highlights de GroupIntro -->
      <div class="value-cols reveal">
        <article v-for="(p, i) in data.items" :key="i" class="value-col">
          <span class="v-icon"><BaseIcon :name="p.icon" :size="24" /></span>
          <h3>{{ t(p.title) }}</h3>
          <p>{{ t(p.text) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
