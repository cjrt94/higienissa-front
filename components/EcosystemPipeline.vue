<script setup>
// Ecosistema HIGIENISSA — las tres marcas como entidades INDEPENDIENTES (no como
// cadena de procesos lineal): grid de iguales, sin riel ni flechas de secuencia.
//   Pacífica (Procesa) · Trazatex (Traza) · Operissa (Opera)
// El nodo `current` (la marca de la página actual) se destaca y no enlaza ("Estás aquí").
// Pacífica + Trazatex se marcan como vinculadas (integradas) y un callout comunica ese
// vínculo explícito + el disclaimer de independencia. Fuente única: settings.json.
const props = defineProps({
  eyebrow: { type: [Object, String], default: '' },
  title: { type: [Object, String], default: '' },
  lead: { type: [Object, String], default: '' },
  current: { type: String, required: true },
  // Superficie: alt (gris) por defecto; false = blanca, para separar cuando la
  // sección previa ya es section-alt (p. ej. Trazatex tras "Respaldo").
  alt: { type: Boolean, default: true },
  // El logo (wordmark) reemplaza al <h3> del nombre: el logo YA lleva el nombre,
  // así que mostrar ambos es repetitivo. Se usa en la home institucional (Nosotros),
  // donde las 3 marcas van iguales. Fallback: si un nodo no tiene logo, se muestra el
  // nombre igual. Las páginas de marca conservan logo + nombre (default false).
  logoAsName: { type: Boolean, default: false },
})
const t = useT()
const localePath = useLocalePath()
const ecosystem = (await useSettings()).ecosystem
const nodes = ecosystem.pipeline
// Pacífica y Trazatex van integradas; el resto, independiente.
const LINKED = ['pacifica', 'trazatex']
const pairing = ecosystem.pairing || { es: 'Pacífica + Trazatex, integradas', en: 'Pacífica + Trazatex, integrated' }
const disclaimer = ecosystem.disclaimer || {
  es: 'Cada marca opera de forma independiente. La trazabilidad de Trazatex se integra con la lavandería de Pacífica para ofrecer una solución conjunta.',
  en: "Each brand operates independently. Trazatex's traceability integrates with Pacífica's laundry to deliver a joint solution.",
}
// Negrita segura por convención **texto** en las descripciones (sin v-html: se
// interpola con {{ }} y se envuelve solo el segmento marcado en <strong>). Mismo
// patrón que HeroFlow, para no imprimir los asteriscos en crudo.
function boldParts(str) {
  const out = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0, m
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) out.push({ t: str.slice(last, m.index), b: false })
    out.push({ t: m[1], b: true })
    last = m.index + m[0].length
  }
  if (last < str.length) out.push({ t: str.slice(last), b: false })
  return out
}
</script>

<template>
  <section id="ecosistema" class="section" :class="{ 'section-alt': alt }">
    <div class="container">
      <div class="section-head center">
        <span v-if="eyebrow" class="kicker">{{ t(eyebrow) }}</span>
        <h2>{{ t(title) }}</h2>
        <p v-if="lead" class="lead">{{ t(lead) }}</p>
      </div>

      <div class="eco-grid reveal" :class="{ 'logo-as-name': logoAsName }">
        <div
          v-for="n in nodes"
          :key="n.slug"
          class="eco-node"
          :class="{ 'is-current': n.slug === current, 'is-linked': LINKED.includes(n.slug) }"
        >
          <span v-if="n.logo" class="eco-logo"><img :src="n.logo" :alt="n.name" loading="lazy" decoding="async"></span>
          <span class="eco-role">{{ t(n.role) }}</span>
          <h3 v-if="!logoAsName || !n.logo">{{ n.name }}</h3>
          <p><template v-for="(part, pi) in boldParts(t(n.desc))" :key="pi"><strong v-if="part.b">{{ part.t }}</strong><template v-else>{{ part.t }}</template></template></p>
          <NuxtLink v-if="n.slug !== current" class="link-arrow" :to="localePath(n.to)">{{ $t('cta.viewMore') }}</NuxtLink>
          <span v-else class="eco-here">{{ $t('cta.youAreHere') }}</span>
        </div>
      </div>

      <!-- Vínculo Pacífica + Trazatex (explícito y acotado) + disclaimer de independencia -->
      <div class="eco-link">
        <span class="eco-link-mark"><BaseIcon name="activity" :size="18" /></span>
        <p><strong>{{ t(pairing) }}.</strong> {{ t(disclaimer) }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.eco-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: stretch;
  gap: clamp(var(--space-4), 2.4vw, var(--space-5));
  margin-top: clamp(var(--space-7), 5vw, var(--space-8));
}
.eco-node {
  position: relative;
  display: flex; flex-direction: column;
  background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius);
  padding: clamp(var(--space-5), 3vw, var(--space-6));
  box-shadow: var(--shadow-xs);
}
/* Logo real de la marca sobre chip claro (mismo tratamiento que el hero) */
.eco-logo { align-self: flex-start; display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 6px 14px; background: #fff; border: 1px solid var(--line); border-radius: 10px; margin-bottom: var(--space-4); }
.eco-logo img { height: 100%; max-height: 26px; width: auto; max-width: 120px; object-fit: contain; display: block; }

/* Cuando el logo sustituye al nombre (Nosotros): gana presencia como identidad de
   la marca, al retirarse el <h3>. */
.logo-as-name .eco-logo { height: 52px; padding: 8px 18px; margin-bottom: var(--space-3); }
.logo-as-name .eco-logo img { max-height: 34px; max-width: 150px; }

.eco-node .eco-role {
  align-self: flex-start;
  font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase;
  color: var(--azul); background: color-mix(in srgb, var(--celeste) 16%, transparent);
  padding: 5px 11px; border-radius: 999px; margin-bottom: var(--space-4);
}
.eco-node h3 { margin: 0 0 var(--space-2); font-size: var(--fs-h3); }
.eco-node p { flex: 1; color: var(--muted); margin: 0 0 var(--space-4); font-size: var(--fs-body-sm); }
.eco-node p strong { color: var(--ink); font-weight: 700; }
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

/* Pacífica + Trazatex: vínculo explícito pero acotado — barra superior en degradado
   que las agrupa (el resto de marcas queda sin ella = independientes). No pisa el
   destacado del nodo actual, que ya tiene su propio borde/relleno. */
.eco-node.is-linked::before {
  content: ""; position: absolute; left: -1px; right: -1px; top: -1px; height: 3px;
  border-radius: var(--radius) var(--radius) 0 0;
  background: linear-gradient(90deg, var(--azul), var(--celeste));
}

/* Callout del vínculo P+T + disclaimer de independencia */
.eco-link {
  display: flex; align-items: flex-start; gap: var(--space-4);
  margin: clamp(var(--space-6), 4vw, var(--space-7)) auto 0; max-width: 820px;
  padding: var(--space-5);
  border: 1px solid color-mix(in srgb, var(--celeste) 40%, var(--line));
  border-radius: var(--radius);
  background: linear-gradient(150deg, rgba(58,120,255,.06), rgba(78,167,225,.05));
}
.eco-link-mark { flex: none; width: 40px; height: 40px; border-radius: var(--radius-chip); background: var(--bg); border: 1px solid var(--line); color: var(--azul); display: inline-flex; align-items: center; justify-content: center; }
.eco-link p { margin: 0; font-size: var(--fs-body-sm); line-height: 1.55; color: var(--text); }
.eco-link strong { color: var(--ink); font-weight: 700; }

@media (max-width: 860px) {
  .eco-grid { grid-template-columns: 1fr; }
  .eco-link { flex-direction: column; gap: var(--space-3); }
}
</style>
