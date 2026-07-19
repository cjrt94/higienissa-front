<script setup>
// Hero de sector inmersivo: foto a sangre + overlay de marca + glow e ícono-motivo
// teñidos por sector. Raíz `.hero` para heredar la compatibilidad del navbar
// transparente (margin-top negativo cuando es el primer hijo de la página).
defineProps({
  icon: { type: String, default: '' },        // ícono de sector (motivo)
  eyebrow: { type: [Object, String], default: '' },
  title: { type: [Object, String], default: '' },
  lead: { type: [Object, String], default: '' },
  image: { type: String, default: '' },
  imageAlt: { type: [Object, String], default: '' },
  badge: { type: Object, default: null },      // { icon, title{es,en}, sub{es,en} }
})
const t = useT()
</script>

<template>
  <section class="hero sector-hero">
    <div class="sh-media">
      <img v-if="image" :src="image" :alt="t(imageAlt)" fetchpriority="high" width="1920" height="1280">
      <span class="sh-scrim" aria-hidden="true" />
      <span class="sh-glow" aria-hidden="true" />
      <BaseIcon v-if="icon" :name="icon" :size="560" :stroke-width="0.8" class="sh-motif" />
    </div>

    <div class="container sh-inner">
      <span class="sh-eyebrow">
        <span v-if="icon" class="sh-chip"><BaseIcon :name="icon" :size="16" /></span>
        <span class="sh-eyebrow-text">{{ t(eyebrow) }}</span>
      </span>
      <h1 class="sh-title">{{ t(title) }}</h1>
      <p class="sh-lead">{{ t(lead) }}</p>
      <div class="sh-actions">
        <BaseButton to="/contacto" variant="primary">{{ $t('cta.evaluation') }}</BaseButton>
        <BaseButton href="#marcas" variant="light">{{ $t('cta.knowMore') }}</BaseButton>
      </div>
      <p v-if="badge" class="sh-badge">
        <span class="sh-badge-ico"><BaseIcon :name="badge.icon || 'scan'" :size="18" /></span>
        <span class="sh-badge-text"><b>{{ t(badge.title) }}</b>{{ t(badge.sub) }}</span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.sector-hero {
  min-height: min(86vh, 820px);
  display: flex;
  align-items: flex-end;
  color: #fff;
  isolation: isolate;
}
/* Capa de imagen a sangre (cubre incluso la franja tras el navbar transparente) */
.sh-media { position: absolute; inset: 0; z-index: -1; overflow: hidden; background: var(--bg-deep); }
.sh-media img { width: 100%; height: 100%; object-fit: cover; }
/* Legibilidad: navy pesado abajo-izquierda, se aclara hacia arriba-derecha.
   La 1ª capa protege la banda del navbar transparente (texto blanco AA ≥4.5:1)
   sin ensuciar la foto: sólo oscurece la franja superior y se desvanece rápido. */
.sh-scrim {
  position: absolute; inset: 0;
  background:
    linear-gradient(180deg, rgba(9,14,32,.5) 0%, rgba(9,14,32,.16) calc(var(--header-h) + 24px), transparent 40%),
    linear-gradient(94deg, rgba(9,14,32,.9) 4%, rgba(9,14,32,.62) 46%, rgba(9,14,32,.3) 100%),
    linear-gradient(0deg, rgba(9,14,32,.82) 0%, rgba(9,14,32,.18) 42%, transparent 72%);
}
/* Glow de sector (temperatura por sector) */
.sh-glow {
  position: absolute; inset: 0;
  background: radial-gradient(46% 60% at 86% 8%, color-mix(in srgb, var(--sector, var(--celeste)) 55%, transparent), transparent 62%);
  opacity: .5; mix-blend-mode: screen;
}
/* Ícono de sector como marca de agua editorial */
.sh-motif {
  position: absolute; top: -6%; right: -4%;
  color: var(--sector, var(--celeste)); opacity: .1;
  filter: drop-shadow(0 8px 40px color-mix(in srgb, var(--sector, var(--celeste)) 40%, transparent));
}

.sh-inner { position: relative; max-width: 62ch; padding-top: var(--space-8); padding-bottom: clamp(var(--space-7), 6vw, var(--space-9)); }

.sh-eyebrow { display: inline-flex; align-items: center; gap: 10px; margin-bottom: var(--space-4); }
.sh-chip {
  display: inline-flex; width: 34px; height: 34px; flex: none; align-items: center; justify-content: center;
  border-radius: var(--radius-chip); color: var(--sector, var(--celeste));
  background: color-mix(in srgb, var(--sector, var(--celeste)) 20%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--sector, var(--celeste)) 42%, transparent);
}
.sh-eyebrow-text { font: 700 var(--fs-kicker)/1 var(--font-body); letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.86); }

.sh-title {
  font-family: var(--font-display); font-weight: 600; letter-spacing: -.01em;
  font-size: clamp(2.1rem, 4.6vw, 3.5rem); line-height: 1.06; margin: 0 0 var(--space-4);
  color: #fff; text-wrap: balance;
}
.sh-lead { font-size: var(--fs-lead); line-height: 1.55; color: rgba(255,255,255,.9); max-width: 56ch; margin: 0 0 var(--space-6); text-wrap: pretty; }

.sh-actions { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-6); }

.sh-badge {
  display: inline-flex; align-items: center; gap: 12px; margin: 0;
  padding: 10px 16px 10px 10px; border-radius: 999px;
  background: rgba(255,255,255,.08); box-shadow: inset 0 0 0 1px rgba(255,255,255,.16);
}
.sh-badge-ico { display: inline-flex; width: 34px; height: 34px; flex: none; align-items: center; justify-content: center; border-radius: 50%; color: var(--sector, var(--celeste)); background: color-mix(in srgb, var(--sector, var(--celeste)) 22%, transparent); }
.sh-badge-text { font-size: var(--fs-small); line-height: 1.25; color: rgba(255,255,255,.82); }
.sh-badge-text b { display: block; color: #fff; font-weight: 700; }

@media (max-width: 640px) {
  .sector-hero { min-height: min(90vh, 680px); }
  .sh-motif { display: none; }
}
</style>
