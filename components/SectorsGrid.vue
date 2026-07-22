<script setup>
defineProps({ data: { type: Object, required: true } })
const t = useT()
const localePath = useLocalePath()
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head center">
        <span class="kicker">{{ t(data.eyebrow) }}</span>
        <h2>{{ t(data.title) }}</h2>
        <p v-if="data.lead" class="lead">{{ t(data.lead) }}</p>
      </div>
      <div class="grid cols-4 reveal stagger">
        <NuxtLink v-for="item in data.items" :key="item.to" class="sector-card" :to="localePath(item.to)">
          <img :src="item.image" :alt="t(item.imageAlt)" width="600" height="800" loading="lazy" decoding="async">
          <span class="sc-body">
            <h3>{{ t(item.name) }}</h3>
            <p>{{ t(item.desc) }}</p>
            <span class="sc-link">{{ $t('cta.seeSector') }}</span>
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
