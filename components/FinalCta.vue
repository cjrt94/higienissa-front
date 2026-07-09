<script setup>
defineProps({ data: { type: Object, required: true } })
const t = useT()
</script>

<template>
  <section class="section cta-band bg-motion">
    <div class="container">
      <h2>{{ t(data.title) }}</h2>
      <p class="lead">{{ t(data.lead) }}</p>
      <div class="cta-actions">
        <BaseButton to="/contacto" variant="light">{{ $t('cta.evaluation') }}</BaseButton>
        <BaseButton to="/institucional" variant="ghost" style="color:#fff;border-color:rgba(255,255,255,.5)">
          {{ $t('cta.knowGroup') }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>
