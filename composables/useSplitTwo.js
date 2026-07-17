// Parte un campo bilingüe (o string) en 2 líneas balanceadas por el punto medio de
// caracteres, para que los títulos de cards siempre ocupen dos líneas y queden homogéneos.
// Devuelve [linea1, linea2]. Si es una sola palabra, la 2ª línea va vacía (reserva el alto).
export function useSplitTwo() {
  const t = useT()
  return (field) => {
    const s = (t(field) || '').trim()
    const words = s.split(/\s+/)
    if (words.length < 2) return [s, ' ']
    const total = s.length
    let acc = 0
    let best = 1
    let bestDiff = Infinity
    for (let i = 0; i < words.length - 1; i++) {
      acc += words[i].length + 1
      const diff = Math.abs(acc - total / 2)
      if (diff < bestDiff) {
        bestDiff = diff
        best = i + 1
      }
    }
    return [words.slice(0, best).join(' '), words.slice(best).join(' ')]
  }
}
