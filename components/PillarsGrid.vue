<script setup>
defineProps({ data: { type: Object, required: true } })
const t = useT()
const pad = (n) => String(n).padStart(2, '0')
</script>

<template>
  <!-- "Lo que nos define": header editorial en 2 columnas (título / foto) sobre
       superficie clara; los pilares se leen como tríptico numerado debajo, no
       como fila de cards. Imagen a la izquierda (reverse) para romper el eco
       con el split de GroupIntro, que la lleva a la derecha. -->
  <section class="section section-alt">
    <div class="container">
      <div class="intro-split reverse">
        <div class="intro-copy">
          <div class="section-head left">
            <span class="kicker">{{ t(data.eyebrow) }}</span>
            <h2>{{ t(data.title) }}</h2>
            <p v-if="data.lead" class="lead">{{ t(data.lead) }}</p>
          </div>
        </div>
        <div class="hero-media">
          <div class="frame frame--portrait">
            <img :src="data.image" :alt="t(data.imageAlt)" width="1000" height="800" loading="lazy" decoding="async">
          </div>
        </div>
      </div>

      <ol class="keypoints reveal stagger">
        <li v-for="(p, i) in data.items" :key="i" class="keypoint">
          <span class="kp-num" aria-hidden="true">{{ pad(i + 1) }}</span>
          <h3>{{ t(p.title) }}</h3>
          <p>{{ t(p.text) }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
