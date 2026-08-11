// Microcopy de UI editable desde el back office (settings.ui) con respaldo en i18n.
//
// Los labels de marketing (CTAs, tagline) viven por defecto en locales/*.json (vía $t),
// pero el cliente puede sobrescribirlos desde /admin/settings → grupo `ui`. Este helper
// devuelve el valor del CMS si existe y NO está vacío; si no, cae al valor de i18n → cero
// regresión aunque el campo quede en blanco.
//
// Uso (setup SÍNCRONO, sin await):
//   const ui = useUiText()
//   ui('cta.evaluation')   // string en el locale activo
//   ui('tagline')
//
// Lee `settings` del caché de useAsyncData ('content:settings', poblado por el layout y el
// footer) mediante useNuxtData: no dispara fetch propio y la función resuelve en tiempo de
// RENDER, cuando Suspense ya resolvió el await del layout → el valor está disponible y es
// reactivo (si llega tarde, re-renderiza).
export function useUiText() {
  const { t: $t } = useI18n()
  const tt = useT()
  const { data: settings } = useNuxtData('content:settings')
  return (key) => {
    const node = String(key).split('.').reduce((o, k) => (o == null ? o : o[k]), settings.value?.ui)
    return tt(node) || $t(key)
  }
}
