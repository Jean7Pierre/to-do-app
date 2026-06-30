import { useDebugValue, useEffect, useState } from 'react'

export default function useDebounce(search: string, time: number) {
  const [debounce, setDebounce] = useState<string>(search)

  // LA FORMA IDEAL OPTIMIZADA:
  useDebugValue(search, () => {
    // Este bloque de código SOLO se ejecuta si abres las DevTools
    return {
      terminoBusqueda: search,
      tiempoDebounce: debounce
    }
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(search)
    }, time)
    return () => {
      clearTimeout(timer)
    }
  }, [search, time])

  return debounce
}
