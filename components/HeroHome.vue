<script setup>
const props = defineProps({ data: { type: Object, required: true } })
const t = useT()
const settings = useSettings()
const brTitle = computed(() => t(props.data.title).replace(/\n/g, '<br>'))
</script>

<template>
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-copy">
        <span class="kicker">{{ t(data.eyebrow) }}</span>
        <h1 class="display" v-html="brTitle" />
        <p class="lead">{{ t(data.lead) }}</p>
        <div class="hero-actions">
          <BaseButton to="/contacto" variant="primary">{{ $t('cta.evaluation') }}</BaseButton>
          <BaseButton href="#ecosistema" variant="ghost">{{ $t('cta.knowEcosystem') }}</BaseButton>
        </div>
        <p class="hero-trust">
          <span class="dot" aria-hidden="true" />
          {{ t(settings.asisStrip.note) }}
        </p>
      </div>
      <div class="hero-media">
        <div class="frame">
          <img :src="data.image" :alt="t(data.imageAlt)" width="1200" height="1020">
        </div>
        <div class="hero-badge">
          <span class="hb-icon"><BaseIcon name="scan" :size="22" /></span>
          <span><b>{{ t(data.badge.title) }}</b><span>{{ t(data.badge.sub) }}</span></span>
        </div>
      </div>
    </div>
  </section>
</template>
