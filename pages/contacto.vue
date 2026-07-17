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
</script>

<template>
  <div>
    <PageHero :eyebrow="page.hero.eyebrow" :title="page.hero.title" :lead="page.hero.lead" />
    <section class="section" style="padding-top:0">
      <div class="container">
        <!-- 2 columnas: riel de contacto (datos reales de settings) + formulario -->
        <div class="contact-layout">
          <aside class="contact-rail">
            <div class="contact-lines">
              <a class="contact-email" :href="`mailto:${settings.contact.email}`">{{ settings.contact.email }}</a>
              <a class="contact-phone" :href="telHref">{{ settings.contact.phone }}</a>
              <span class="contact-city">{{ t(settings.contact.city) }}</span>
            </div>
            <p class="contact-asis">{{ t(settings.asisStrip.note) }}</p>
          </aside>
          <div class="contact-form-col">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact-layout { display: grid; grid-template-columns: 0.82fr 1.18fr; gap: clamp(var(--space-6), 5vw, var(--space-9)); align-items: start; }
.contact-rail { padding-top: var(--space-3); }
.contact-lines { display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-6); }
.contact-email { font: 600 1.2rem var(--font-body); color: var(--ink); }
.contact-email:hover { color: var(--electrico); }
.contact-phone { color: var(--text); font-size: 1.05rem; }
.contact-phone:hover { color: var(--electrico); }
.contact-city { color: var(--muted); }
.contact-asis { font-size: var(--fs-small); line-height: 1.6; color: var(--muted); border-top: 1px solid var(--line); padding-top: var(--space-4); max-width: 34ch; margin: 0; }
.contact-form-col :deep(.form-panel) { max-width: none; }
@media (max-width: 860px) {
  .contact-layout { grid-template-columns: 1fr; gap: var(--space-6); }
  .contact-rail { padding-top: 0; }
}
</style>
