<script setup>
// Lista editorial reutilizable: filas apiladas con divisor + marcador (no cards, no bullets planos).
// items: array de campos bilingües { es, en } (texto simple) o de objetos { title, desc, icon }.
// marker: risk (!) | gain (✓) | number | icon | none
const props = defineProps({
  items: { type: Array, required: true },
  marker: { type: String, default: 'none' },
})
const t = useT()
const isRich = (it) => it && typeof it === 'object' && !('es' in it) && ('title' in it || 'desc' in it)
</script>

<template>
  <ol class="stake-list" :class="`marker-${marker}`">
    <li v-for="(it, i) in items" :key="i" class="stake-row">
      <span class="stake-marker" aria-hidden="true">
        <span v-if="marker === 'number'" class="num">{{ i + 1 }}</span>
        <BaseIcon v-else-if="marker === 'icon' && it.icon" :name="it.icon" :size="22" />
        <span v-else class="glyph" />
      </span>
      <div class="stake-body">
        <template v-if="isRich(it)">
          <h3 class="stake-title">{{ t(it.title) }}</h3>
          <p v-if="it.desc" class="stake-desc">{{ t(it.desc) }}</p>
        </template>
        <span v-else class="stake-text">{{ t(it) }}</span>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.stake-list { list-style: none; margin: 0; padding: 0; }
.stake-row { display: flex; gap: var(--space-4); align-items: flex-start; padding: var(--space-4) 0; border-top: 1px solid var(--line); }
.stake-row:first-child { border-top: 0; }
.stake-marker { flex: none; width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: 1.5px solid currentColor; font: 700 15px/1 var(--font-body); margin-top: 2px; }
.marker-risk .stake-marker { color: var(--azul); }
.marker-gain .stake-marker { color: var(--azul); }
.marker-number .stake-marker { color: #fff; background: var(--azul); border-color: var(--azul); }
.marker-icon .stake-marker { color: var(--azul); background: linear-gradient(150deg, rgba(58,120,255,.12), rgba(78,167,225,.10)); border: 0; width: 46px; height: 46px; border-radius: 13px; }
.marker-risk .glyph::before { content: "!"; }
.marker-gain .glyph::before { content: "\2713"; }
.stake-body { flex: 1; padding-top: 4px; }
.stake-title { margin: 0 0 4px; font-size: 1.12rem; }
.stake-desc { margin: 0; color: var(--text); }
.stake-text { font-size: 1.08rem; color: var(--ink); line-height: 1.5; }
</style>
