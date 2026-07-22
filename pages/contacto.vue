<script setup>
const page = usePageContent('contacto')
const t = useT()
const settings = useSettings()

useSeoMeta({
  title: () => t(page.seo.title),
  description: () => t(page.seo.description),
  ogTitle: () => t(page.seo.title),
  ogDescription: () => t(page.seo.description),
})

const telHref = computed(() => `tel:${settings.contact.phone.replace(/\s+/g, '')}`)
const brands = computed(() => settings.ecosystem?.pipeline ?? [])
</script>

<template>
  <div>
    <PageHero :eyebrow="page.hero.eyebrow" :title="page.hero.title" :lead="page.hero.lead" />

    <!-- Panel de acento (datos reales de settings) + formulario -->
    <section class="section" style="padding-top:0">
      <div class="container">
        <div class="contact-layout">
          <aside class="contact-aside bg-motion">
            <div class="ca-inner">
              <span class="kicker on-dark">{{ t(page.aside.kicker) }}</span>
              <h2>{{ t(page.aside.title) }}</h2>
              <p class="ca-lead">{{ t(page.aside.lead) }}</p>

              <p class="ca-label">{{ t(page.aside.channelsLabel) }}</p>
              <ul class="ca-channels">
                <li>
                  <span class="ca-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                  </span>
                  <span class="ca-text">
                    <span class="ca-k">{{ t(page.aside.emailLabel) }}</span>
                    <a class="ca-v" :href="`mailto:${settings.contact.email}`">{{ settings.contact.email }}</a>
                  </span>
                </li>
                <li>
                  <span class="ca-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h2l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v2a2 2 0 0 1-2 2A16 16 0 0 1 4 5z"/></svg>
                  </span>
                  <span class="ca-text">
                    <span class="ca-k">{{ t(page.aside.phoneLabel) }}</span>
                    <a class="ca-v" :href="telHref">{{ settings.contact.phone }}</a>
                  </span>
                </li>
                <li>
                  <span class="ca-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                  </span>
                  <span class="ca-text">
                    <span class="ca-k">{{ t(page.aside.cityLabel) }}</span>
                    <span class="ca-v">{{ t(settings.contact.city) }}</span>
                  </span>
                </li>
              </ul>

              <div class="ca-response">
                <span class="ca-response-label">{{ t(page.aside.responseLabel) }}</span>
                <span class="ca-response-value">{{ t(page.aside.responseValue) }}</span>
              </div>
            </div>
          </aside>

          <div class="contact-form-col">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>

    <!-- Cómo trabajamos: proceso numerado -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.process.kicker) }}</span>
          <h2>{{ t(page.process.title) }}</h2>
          <p class="lead">{{ t(page.process.lead) }}</p>
        </div>
        <ol class="proc-steps reveal stagger">
          <li v-for="step in page.process.steps" :key="step.n" class="proc-step">
            <span class="proc-num">{{ step.n }}</span>
            <h3>{{ t(step.title) }}</h3>
            <p>{{ t(step.desc) }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Respaldo del ecosistema (sin ASIS) -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="kicker">{{ t(page.ecosystem.kicker) }}</span>
          <h2>{{ t(page.ecosystem.title) }}</h2>
          <p class="lead">{{ t(page.ecosystem.lead) }}</p>
        </div>
        <div class="eco-grid">
          <NuxtLink v-for="b in brands" :key="b.slug" :to="b.to" class="eco-card">
            <span class="eco-role">{{ t(b.role) }}</span>
            <span class="eco-name">{{ b.name }}</span>
            <span class="eco-desc">{{ t(b.desc) }}</span>
            <span class="eco-link link-arrow">{{ $t('cta.know') }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ---- Layout de contacto: panel de acento + formulario ---- */
.contact-layout { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(var(--space-6), 4vw, var(--space-8)); align-items: stretch; }

/* Panel de acento navy (misma familia que .cta-band / .asis-strip) */
.contact-aside {
  border-radius: var(--radius-lg);
  background: linear-gradient(150deg, #0F1836 0%, #1C2A87 62%, #22347f 100%);
  color: rgba(255,255,255,.82);
  box-shadow: var(--shadow-md);
  --motion-dur: 22s; --m1: .30; --m2: .24; --m3: .40;
}
.ca-inner { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; padding: clamp(var(--space-5), 4vw, var(--space-7)); }
.contact-aside h2 { color: #fff; font-size: var(--fs-h3); margin: 0 0 var(--space-3); }
.ca-lead { color: rgba(255,255,255,.82); margin: 0 0 var(--space-6); font-size: var(--fs-lead); line-height: 1.6; max-width: 40ch; }

.ca-label { font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .14em; text-transform: uppercase; color: #8FD0FF; margin: 0 0 var(--space-4); }

.ca-channels { list-style: none; margin: 0 0 auto; padding: 0; display: flex; flex-direction: column; gap: var(--space-4); }
.ca-channels li { display: flex; gap: var(--space-4); align-items: center; margin: 0; }
.ca-ico { width: 42px; height: 42px; flex: none; border-radius: var(--radius-chip); background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14); color: #8FD0FF; display: flex; align-items: center; justify-content: center; }
.ca-ico svg { width: 20px; height: 20px; }
.ca-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.ca-k { font-size: var(--fs-small); color: rgba(255,255,255,.60); }
.ca-v { font: 600 var(--fs-body) var(--font-body); color: #fff; word-break: break-word; }
a.ca-v:hover { color: #8FD0FF; }

.ca-response { margin-top: var(--space-6); padding-top: var(--space-5); border-top: 1px solid rgba(255,255,255,.14); }
.ca-response-label { display: block; font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .14em; text-transform: uppercase; color: #8FD0FF; margin-bottom: 6px; }
.ca-response-value { display: block; font-size: var(--fs-small); color: rgba(255,255,255,.82); line-height: 1.6; }

.contact-form-col { display: flex; }
.contact-form-col :deep(.form-panel) { max-width: none; width: 100%; }

/* ---- Proceso numerado ---- */
.proc-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(var(--space-5), 3vw, var(--space-7)); counter-reset: none; }
.proc-step { border-top: 2px solid var(--line); padding-top: var(--space-5); }
.proc-num { display: inline-block; font: 500 1.9rem/1 var(--font-display); color: var(--sector-ink, #1E6FA8); letter-spacing: .01em; margin-bottom: var(--space-4); }
.proc-step h3 { font-size: var(--fs-h4); margin: 0 0 var(--space-2); }
.proc-step p { color: var(--muted); margin: 0; font-size: var(--fs-body-sm); }

/* ---- Respaldo del ecosistema ---- */
.eco-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
.eco-card {
  display: flex; flex-direction: column; gap: 6px;
  background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius);
  padding: var(--space-6) var(--space-5); box-shadow: var(--shadow-xs);
  transition: box-shadow .22s var(--ease), transform .22s var(--ease), border-color .22s var(--ease);
}
.eco-card:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); border-color: color-mix(in srgb, var(--celeste) 45%, var(--line)); }
.eco-card:focus-visible { outline: none; box-shadow: inset 0 0 0 3px var(--electrico), var(--shadow-md); }
.eco-role { font: 700 var(--fs-kicker) var(--font-body); letter-spacing: .12em; text-transform: uppercase; color: #1E6FA8; }
.eco-name { font: 500 var(--fs-h3) var(--font-display); color: var(--ink); line-height: 1.1; }
.eco-desc { color: var(--text); font-size: var(--fs-body-sm); flex: 1; margin-top: 2px; }
.eco-link { margin-top: var(--space-3); }

@media (max-width: 900px) {
  .contact-layout { grid-template-columns: 1fr; gap: var(--space-6); }
  .proc-steps { grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
  .eco-grid { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .proc-steps { grid-template-columns: 1fr; }
}
</style>
