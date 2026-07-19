import { z } from 'zod'

// Formulario de contacto → contactSubmissions (NO bilingüe: son datos del usuario).
// name + lastName separados; validación de longitud máxima en todos los textos.
//
// Los MENSAJES de error sí son bilingües: el schema es una factory que recibe un
// traductor `t` (claves contact.errors.*). El cliente pasa el `t` de i18n (ES/EN);
// el servidor pasa un lookup sobre el locale ES. Registro: "usted" (audiencia PE),
// coherente con el resto del copy del sitio.
export function contactSchema(t) {
  const m = (key, params) => (t ? t(key, params) : key)
  // Campo de texto requerido: el mismo mensaje cubre vacío ("") y ausente (undefined),
  // porque vee-validate inicializa los campos sin tocar como undefined.
  const reqStr = (key) => z.string({ required_error: m(key), invalid_type_error: m(key) }).min(1, m(key))
  return z.object({
    name: reqStr('contact.errors.nameReq').max(60, m('contact.errors.max', { n: 60 })),
    lastName: reqStr('contact.errors.lastNameReq').max(60, m('contact.errors.max', { n: 60 })),
    position: z.string().max(80, m('contact.errors.max', { n: 80 })).optional().default(''),
    company: reqStr('contact.errors.companyReq').max(100, m('contact.errors.max', { n: 100 })),
    sector: z.enum(['salud', 'hoteleria', 'industria', 'mineria', 'otro'], {
      errorMap: () => ({ message: m('contact.errors.sectorReq') }),
    }),
    email: reqStr('contact.errors.emailReq').email(m('contact.errors.emailInvalid')).max(120, m('contact.errors.max', { n: 120 })),
    message: reqStr('contact.errors.messageReq').max(1200, m('contact.errors.max', { n: 1200 })),
    ctaContext: z.enum(['evaluacion', 'diagnostico']).default('evaluacion'),
    consent: z.literal(true, { errorMap: () => ({ message: m('contact.errors.consentReq') }) }),
  })
}
