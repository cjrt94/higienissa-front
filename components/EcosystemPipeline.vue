<script setup>
// Ecosistema HIGIENISSA como pipeline de 3 nodos en orden fijo:
//   Pacífica (Procesa) → Trazatex (Traza) → Operissa (Opera).
// El nodo `current` (la marca de la página actual) se destaca y no enlaza ("Estás aquí");
// los otros dos enlazan a su marca. La fuente única de los nodos vive en settings.json.
const props = defineProps({
  eyebrow: { type: [Object, String], default: '' },
  title: { type: [Object, String], default: '' },
  lead: { type: [Object, String], default: '' },
  current: { type: String, required: true },
  // Superficie: alt (gris) por defecto; false = blanca, para separar cuando la
  // sección previa ya es section-alt (p. ej. Trazatex tras "Respaldo").
  alt: { type: Boolean, default: true },
})
const t = useT()
const localePath = useLocalePath()
const nodes = (await useSettings()).ecosystem.pipeline
</script>

<template>
  <section id="ecosistema" class="section" :class="{ 'section-alt': alt }">
    <div class="container">
      <div class="section-head center">
        <span v-if="eyebrow" class="kicker">{{ t(eyebrow) }}</span>
        <h2>{{ t(title) }}</h2>
        <p v-if="lead" class="lead">{{ t(lead) }}</p>
      </div>

      <div class="eco-flow reveal">
        <template v-for="(n, i) in nodes" :key="n.slug">
          <div v-if="i > 0" class="eco-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </div>
          <div class="eco-node" :class="{ 'is-current': n.slug === current }">
            <span class="eco-role">{{ t(n.role) }}</span>
            <h3>{{ n.name }}</h3>
            <p>{{ t(n.desc) }}</p>
            <NuxtLink v-if="n.slug !== current" class="link-arrow" :to="localePath(n.to)">{{ $t('cta.viewMore') }}</NuxtLink>
            <span v-else class="eco-here">{{ $t('cta.youAreHere') }}</span>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.eco-flow {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: stretch;
  gap: clamp(var(--space-2), 1.6vw, var(--space-4));
  margin-top: clamp(var(--space-7), 5vw, var(--space-8));
}
.eco-node {
  display: flex; flex-direction: column;
  background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius);
  padding: clamp(var(--space-5), 3vw, var(--space-6));
  box-shadow: var(--shadow-xs);
}
.eco-node .eco-role {
  align-self: flex-start;
  font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase;
  color: var(--azul); background: color-mix(in srgb, var(--celeste) 16%, transparent);
  padding: 5px 11px; border-radius: 999px; margin-bottom: var(--space-4);
}
.eco-node h3 { margin: 0 0 var(--space-2); font-size: var(--fs-h3); }
.eco-node p { flex: 1; color: var(--muted); margin: 0 0 var(--space-4); font-size: var(--fs-body-sm); }
.eco-node .link-arrow { margin-top: auto; }

/* Nodo actual: dominante, superficie branded y borde celeste */
.eco-node.is-current {
  background: linear-gradient(160deg, color-mix(in srgb, var(--azul) 8%, var(--bg)), var(--bg));
  border-color: color-mix(in srgb, var(--celeste) 55%, var(--line));
  box-shadow: var(--shadow-md);
}
.eco-node.is-current .eco-role {
  color: #fff;
  background: linear-gradient(135deg, var(--azul), color-mix(in srgb, var(--celeste) 70%, var(--azul)));
}
.eco-here {
  margin-top: auto; align-self: flex-start; display: inline-flex; align-items: center; gap: 8px;
  font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .1em; text-transform: uppercase; color: var(--celeste);
}
.eco-here::before {
  content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--celeste);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--celeste) 25%, transparent);
}

/* Conector */
.eco-arrow { display: flex; align-items: center; justify-content: center; color: color-mix(in srgb, var(--azul) 42%, var(--line)); }
.eco-arrow svg { width: 30px; height: 30px; }

@media (max-width: 860px) {
  .eco-flow { grid-template-columns: 1fr; }
  .eco-arrow { transform: rotate(90deg); padding: var(--space-2) 0; }
}
</style>
