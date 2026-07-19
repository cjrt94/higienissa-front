<script setup>
// Impacto por rol: split entre un panel visual (foto del sector si existe, si no el
// ícono-motivo teñido) y un ledger numerado de roles. Índice serif teñido por sector.
defineProps({
  kicker: { type: [Object, String], default: '' },
  title: { type: [Object, String], default: '' },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  imageAlt: { type: [Object, String], default: '' },
  items: { type: Array, default: () => [] }, // [{ title, desc }]
})
const t = useT()
</script>

<template>
  <section class="section sector-roles">
    <div class="container roles-split">
      <div class="roles-aside">
        <div class="roles-head">
          <span class="roles-kicker">{{ t(kicker) }}</span>
          <h2 class="roles-title">{{ t(title) }}</h2>
        </div>
        <figure v-if="image" class="roles-media reveal">
          <img :src="image" :alt="t(imageAlt)" width="900" height="1040" loading="lazy">
        </figure>
        <div v-else class="roles-motif reveal" aria-hidden="true">
          <BaseIcon v-if="icon" :name="icon" :size="120" :stroke-width="1.1" />
        </div>
      </div>

      <ol class="roles-list reveal">
        <li v-for="(it, i) in items" :key="i" class="roles-row">
          <span class="roles-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="roles-body">
            <h3 class="roles-role">{{ t(it.title) }}</h3>
            <p class="roles-desc">{{ t(it.desc) }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.roles-split { display: grid; grid-template-columns: .9fr 1.1fr; gap: clamp(var(--space-6), 5vw, var(--space-9)); align-items: start; }

.roles-aside { position: sticky; top: calc(var(--header-h) + 28px); }
.roles-head { margin-bottom: var(--space-6); }
.roles-kicker { display: inline-block; font: 700 var(--fs-kicker)/1 var(--font-body); letter-spacing: .16em; text-transform: uppercase; color: var(--sector-ink, var(--azul)); margin-bottom: var(--space-3); }
.roles-title { font-size: var(--fs-h2); line-height: 1.14; margin: 0; max-width: 20ch; }

.roles-media { margin: 0; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md); aspect-ratio: 4/4.2; background: var(--bg-alt); }
.roles-media img { width: 100%; height: 100%; object-fit: cover; }
.roles-motif {
  display: flex; align-items: center; justify-content: center; aspect-ratio: 4/3;
  border-radius: var(--radius-lg); color: var(--sector-ink, var(--azul));
  background:
    radial-gradient(120% 120% at 100% 0%, var(--sector-soft, rgba(78,167,225,.12)), transparent 60%),
    var(--bg-alt);
  box-shadow: inset 0 0 0 1px var(--line);
}

.roles-list { list-style: none; margin: 0; padding: 0; }
.roles-row { display: flex; gap: var(--space-5); align-items: flex-start; padding: clamp(var(--space-5), 3vw, var(--space-6)) 0; margin: 0; border-top: 1px solid var(--line); }
.roles-row:first-child { border-top: 0; padding-top: 0; }
.roles-num { flex: none; font: 600 1.5rem/1 var(--font-display); color: var(--sector-ink, var(--azul)); letter-spacing: .01em; min-width: 2.4rem; }
.roles-body { min-width: 0; }
.roles-role { font-size: var(--fs-h3); line-height: 1.2; margin: 0 0 var(--space-2); }
.roles-desc { margin: 0; color: var(--text); line-height: 1.55; max-width: 52ch; }

@media (max-width: 860px) {
  .roles-split { grid-template-columns: 1fr; gap: var(--space-7); }
  .roles-aside { position: static; }
  .roles-title { max-width: none; }
}
</style>
