<script setup>
// "La plataforma en vivo": grilla de capturas del panel del socio tecnológico,
// cada una enmarcada (chrome de navegador) con etiqueta + pie. Debajo, los
// diferenciadores y el CTA a demo. Datos bilingües { es, en } vía useT.
const props = defineProps({ data: { type: Object, required: true } })
const t = useT()
</script>

<template>
  <section class="section platform">
    <div class="container">
      <div class="section-head">
        <span class="kicker">{{ t(data.kicker) }}</span>
        <h2>{{ t(data.title) }}</h2>
        <p v-if="data.lead" class="lead mx-auto">{{ t(data.lead) }}</p>
      </div>

      <div class="pf-grid reveal">
        <figure v-for="(s, i) in data.shots" :key="i" class="pf-shot">
          <div class="pf-frame">
            <span class="pf-chrome" aria-hidden="true"><i></i><i></i><i></i></span>
            <img :src="s.src" :alt="t(s.alt)" width="1400" height="648" loading="lazy" decoding="async">
          </div>
          <figcaption>
            <span class="pf-tag">{{ t(s.tag) }}</span>
            <p>{{ t(s.caption) }}</p>
          </figcaption>
        </figure>
      </div>

      <ul v-if="data.features" class="pf-features reveal">
        <li v-for="(f, i) in data.features" :key="i" class="pf-feat">
          <span class="pf-feat-icon"><BaseIcon :name="f.icon" :size="22" /></span>
          <div>
            <h3>{{ t(f.title) }}</h3>
            <p>{{ t(f.desc) }}</p>
          </div>
        </li>
      </ul>

      <div class="pf-foot">
        <p v-if="data.note" class="pf-note">{{ t(data.note) }}</p>
        <BaseButton v-if="data.cta" :to="data.cta.to" variant="primary">{{ t(data.cta.label) }}</BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.platform .section-head .lead { max-width: 62ch; }

/* Grilla uniforme de capturas (todas al mismo ratio 2.16:1).
   Flex + última fila centrada: si faltan cards para completar la fila, los
   restantes se centran en vez de dejar un hueco a la derecha. */
.pf-grid { --pf-gap: clamp(var(--space-5), 3vw, var(--space-6)); display: flex; flex-wrap: wrap; justify-content: center; gap: var(--pf-gap); margin-top: clamp(var(--space-6), 4vw, var(--space-8)); }
.pf-shot { margin: 0; display: flex; flex-direction: column; flex: 0 1 calc((100% - 2 * var(--pf-gap)) / 3); max-width: calc((100% - 2 * var(--pf-gap)) / 3); }
.pf-frame { border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-md); background: var(--bg); }
.pf-chrome { display: flex; gap: 6px; padding: 9px 12px; background: var(--bg-alt); border-bottom: 1px solid var(--line); }
.pf-chrome i { width: 9px; height: 9px; border-radius: 50%; background: var(--line); }
.pf-chrome i:first-child { background: #e0645a; }
.pf-chrome i:nth-child(2) { background: #e6b23c; }
.pf-chrome i:nth-child(3) { background: #5db15d; }
.pf-frame img { display: block; width: 100%; height: auto; }
.pf-shot figcaption { padding: var(--space-4) 2px 0; }
.pf-tag { display: inline-block; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .1em; text-transform: uppercase; color: var(--azul); margin-bottom: 6px; }
.pf-shot figcaption p { margin: 0; font-size: .92rem; color: var(--muted); line-height: 1.5; }

/* Diferenciadores */
.pf-features { list-style: none; margin: clamp(var(--space-7), 5vw, var(--space-9)) 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); }
.pf-feat { display: flex; flex-direction: column; gap: var(--space-3); background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius); padding: var(--space-5); box-shadow: var(--shadow-xs); }
.pf-feat-icon { display: inline-flex; width: 46px; height: 46px; align-items: center; justify-content: center; border-radius: var(--radius-chip); color: var(--azul); background: linear-gradient(150deg, rgba(58,120,255,.12), rgba(78,167,225,.10)); }
.pf-feat h3 { font-size: 1rem; margin: 0 0 4px; }
.pf-feat p { margin: 0; font-size: .9rem; color: var(--muted); line-height: 1.5; }

/* Sello de alianza + CTA */
.pf-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-5); margin-top: clamp(var(--space-7), 5vw, var(--space-8)); padding-top: var(--space-6); border-top: 1px solid var(--line); }
.pf-note { margin: 0; max-width: 60ch; font-size: var(--fs-small); color: var(--muted); }

@media (max-width: 900px) {
  .pf-shot { flex-basis: calc((100% - var(--pf-gap)) / 2); max-width: calc((100% - var(--pf-gap)) / 2); }
  .pf-features { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .pf-shot { flex-basis: 100%; max-width: 100%; }
  .pf-features { grid-template-columns: 1fr; }
  .pf-foot { flex-direction: column; align-items: flex-start; }
}
</style>
