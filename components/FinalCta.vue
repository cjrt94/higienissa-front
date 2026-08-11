<script setup>
defineProps({ data: { type: Object, required: true } })
const t = useT()
const ui = useUiText()
</script>

<template>
  <section class="section cta-band bg-motion">
    <div class="container">
      <h2>{{ t(data.title) }}</h2>
      <p class="lead">{{ t(data.lead) }}</p>
      <div class="cta-actions">
        <BaseButton to="/contacto" variant="light">{{ ui('cta.evaluation') }}</BaseButton>
        <BaseButton to="/institucional" variant="ghost">
          {{ ui('cta.knowGroup') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>
