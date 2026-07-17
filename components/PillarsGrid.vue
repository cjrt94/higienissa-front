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
      <div class="pillar-cols reveal">
        <article v-for="(p, i) in data.items" :key="i" class="pillar-col">
          <span class="pillar-ic"><BaseIcon :name="p.icon" :size="24" /></span>
          <h3>{{ t(p.title) }}</h3>
          <p>{{ t(p.text) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pillar-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(var(--space-6), 4vw, var(--space-8)); }
.pillar-col { padding-top: var(--space-5); border-top: 2px solid var(--ink); }
.pillar-ic { display: inline-flex; width: 46px; height: 46px; align-items: center; justify-content: center; border-radius: 13px; background: linear-gradient(150deg, rgba(58,120,255,.12), rgba(78,167,225,.10)); color: var(--azul); margin-bottom: var(--space-4); }
.pillar-col h3 { font-size: clamp(1.3rem, 1.8vw, 1.55rem); margin-bottom: var(--space-3); }
.pillar-col p { margin: 0; color: var(--text); }
@media (max-width: 760px) {
  .pillar-cols { grid-template-columns: 1fr; gap: var(--space-6); }
}
</style>
