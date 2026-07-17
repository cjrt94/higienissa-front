<script setup>
defineProps({ data: { type: Object, required: true } })
const t = useT()
const localePath = useLocalePath()
</script>

<template>
  <section id="ecosistema" class="section">
    <div class="container">
      <div class="section-head center">
        <span class="kicker">{{ t(data.eyebrow) }}</span>
        <h2>{{ t(data.title) }}</h2>
      </div>
      <div class="grid cols-3 reveal">
        <article v-for="item in data.items" :key="item.name" class="card">
          <div class="card-media">
            <img :src="item.image" :alt="t(item.imageAlt)" width="800" height="500" loading="lazy">
          </div>
          <div class="card-body">
            <span class="card-eyebrow">{{ t(item.eyebrow) }}</span>
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
