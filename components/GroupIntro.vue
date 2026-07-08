<script setup>
defineProps({ data: { type: Object, required: true } })
const t = useT()
</script>

<template>
  <section class="section section-alt">
    <div class="container">
      <div class="intro-split">
        <div class="intro-copy">
          <div class="section-head left">
            <span class="kicker">{{ t(data.eyebrow) }}</span>
            <h2>{{ t(data.title) }}</h2>
            <p class="lead">{{ t(data.lead) }}</p>
          </div>
        </div>
        <div class="hero-media">
          <div class="frame" style="aspect-ratio:4/3.2;box-shadow:var(--shadow-md)">
            <img :src="data.image" :alt="t(data.imageAlt)" width="1000" height="800" loading="lazy">
          </div>
        </div>
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
