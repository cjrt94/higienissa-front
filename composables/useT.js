// Helper para contenido editorial bilingüe guardado como { es, en }.
// Uso: const t = useT();  t(block.title)  → string en el locale activo (fallback ES).
export function useT() {
  const { locale } = useI18n()
  return (field) => {
    if (field == null) return ''
    if (typeof field === 'string') return field
    return field[locale.value] ?? field.es ?? field.en ?? ''
  }
}
