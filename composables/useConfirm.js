// Confirmación propia basada en promesa (nunca confirm() nativo).
// Renderizada por <ConfirmDialog/>. Uso: if (await confirm({ title, message })) { … }
export function useConfirm() {
  const state = useState('ui.confirm', () => ({ open: false, title: '', message: '', confirmText: 'Confirmar', cancelText: 'Cancelar', _resolve: null }))

  function confirm(opts = {}) {
    return new Promise((resolve) => {
      state.value = {
        open: true,
        title: opts.title || '¿Confirmar acción?',
        message: opts.message || '',
        confirmText: opts.confirmText || 'Confirmar',
        cancelText: opts.cancelText || 'Cancelar',
        danger: !!opts.danger,
        _resolve: resolve,
      }
    })
  }
  function answer(value) {
    state.value.open = false
    state.value._resolve?.(value)
  }
  return { state, confirm, answer }
}
