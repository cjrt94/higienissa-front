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
      <div class="pillars cols-3 reveal">
        <div v-for="(p, i) in data.items" :key="i" class="pillar">
          <span class="pillar-icon"><BaseIcon :name="p.icon" :size="26" /></span>
          <h3>{{ t(p.title) }}</h3>
          <p>{{ t(p.text) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
