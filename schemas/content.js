import { z } from 'zod'

// Campo bilingüe { es, en }. ES requerido; EN opcional (fallback a ES en el render).
export const bi = (max = 280) =>
  z.object({
    es: z.string().min(1, 'Requerido.').max(max, `Máximo ${max} caracteres.`),
    en: z.string().max(max, `Máximo ${max} caracteres.`).optional().default(''),
  })

export const biLong = (max = 1200) => bi(max)

export const seoSchema = z.object({
  title: bi(70),
  description: bi(180),
})

export const imageSchema = z.object({
  url: z.string().url('URL inválida.').or(z.literal('')),
  path: z.string().optional().default(''),
  alt: bi(160),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
})

// --- Bloques del sitio (data por tipo). Cada uno = 1 componente de render + 1 editor. ---
export const blockSchemas = {
  hero: z.object({
    eyebrow: bi(60),
    title: bi(120),
    lead: biLong(400),
    image: z.string(),
    imageAlt: bi(160),
    badge: z.object({ title: bi(60), sub: bi(120) }),
  }),
  groupIntro: z.object({
    eyebrow: bi(60), title: bi(120), lead: biLong(600),
    image: z.string(), imageAlt: bi(160),
    highlights: z.array(z.object({ icon: z.string(), label: bi(60), text: bi(200) })).max(6),
  }),
  divisions: z.object({
    eyebrow: bi(60), title: bi(120),
    items: z.array(z.object({
      eyebrow: bi(60), name: z.string().max(60), desc: biLong(400),
      image: z.string(), imageAlt: bi(160), to: z.string(),
    })).max(6),
  }),
  pillars: z.object({
    eyebrow: bi(60), title: bi(120),
    items: z.array(z.object({ icon: z.string(), title: bi(60), text: bi(240) })).max(6),
  }),
  sectorsBlock: z.object({
    eyebrow: bi(60), title: bi(120),
    items: z.array(z.object({ name: bi(40), desc: bi(160), image: z.string(), imageAlt: bi(160), to: z.string() })).max(8),
  }),
  asis: z.object({
    eyebrow: bi(60), title: bi(120), body: biLong(600),
    image: z.string(), imageAlt: bi(160),
    metrics: z.array(z.object({ value: z.any(), label: bi(60) })).max(4),
  }),
  finalCta: z.object({ title: bi(80), lead: biLong(300) }),
  richText: z.object({ title: bi(120), body: biLong(4000) }),
}

export const pageSchema = z.object({
  slug: z.string(),
  template: z.string(),
  status: z.enum(['draft', 'published']).default('draft'),
  seo: seoSchema,
  blocks: z.array(z.object({
    id: z.string(),
    type: z.string(),
    order: z.number(),
    data: z.record(z.any()),
  })),
})

export function validateBlock(type, data) {
  const schema = blockSchemas[type]
  if (!schema) return { success: true, data } // tipos sin schema: passthrough
  return schema.safeParse(data)
}
