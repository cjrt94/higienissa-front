import { z } from 'zod'

// Formulario de contacto → contactSubmissions (NO bilingüe: son datos del usuario).
// name + lastName separados; validación de longitud máxima en todos los textos.
export const contactSchema = z.object({
  name: z.string().min(1, 'Ingresá tu nombre.').max(60, 'Máximo 60 caracteres.'),
  lastName: z.string().min(1, 'Ingresá tu apellido.').max(60, 'Máximo 60 caracteres.'),
  position: z.string().max(80, 'Máximo 80 caracteres.').optional().default(''),
  company: z.string().min(1, 'Ingresá tu empresa.').max(100, 'Máximo 100 caracteres.'),
  sector: z.enum(['salud', 'hoteleria', 'industria', 'mineria', 'otro'], {
    errorMap: () => ({ message: 'Elegí un sector.' }),
  }),
  email: z.string().min(1, 'Ingresá tu email.').email('Email inválido.').max(120),
  message: z.string().min(1, 'Escribí tu mensaje.').max(1200, 'Máximo 1200 caracteres.'),
  ctaContext: z.enum(['evaluacion', 'diagnostico']).default('evaluacion'),
  consent: z.literal(true, { errorMap: () => ({ message: 'Necesitamos tu consentimiento.' }) }),
})
