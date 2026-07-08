// Toasts propios (nunca alert nativo). Renderizados por <ToastHost/> en el layout admin.
export function useToast() {
  const toasts = useState('ui.toasts', () => [])
  let seq = 0
  function push(message, type = 'info', timeout = 3500) {
    const id = ++seq + '-' + toasts.value.length
    toasts.value.push({ id, message, type })
    if (timeout) setTimeout(() => remove(id), timeout)
    return id
  }
  function remove(id) {
    const i = toasts.value.findIndex((t) => t.id === id)
    if (i >= 0) toasts.value.splice(i, 1)
  }
  return {
    toasts,
    remove,
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error', 6000),
    info: (m) => push(m, 'info'),
  }
}
