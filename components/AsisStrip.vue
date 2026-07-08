<script setup>
defineProps({ data: { type: Object, required: true } })
const t = useT()
const localePath = useLocalePath()
</script>

<template>
  <section id="respaldo" class="asis-strip">
    <div class="container asis-inner">
      <div class="asis-media">
        <img :src="data.image" :alt="t(data.imageAlt)" width="800" height="500" loading="lazy">
      </div>
      <div class="asis-copy">
        <span class="kicker on-dark">{{ t(data.eyebrow) }}</span>
        <h2>{{ t(data.title) }}</h2>
        <p>{{ t(data.body) }}</p>
        <div class="asis-metrics">
          <span v-for="(m, i) in data.metrics" :key="i" class="m">
            <b>{{ t(m.value) }}</b><span>{{ t(m.label) }}</span>
          </span>
        </div>
        <p style="margin-top:var(--space-4)">
          <NuxtLink class="link-arrow" :to="localePath('/marca-trazatex')">
            {{ $t('cta.know') }} Trazatex
          </NuxtLink>
        </p>
      </div>
    </div>
  </section>
</template>
