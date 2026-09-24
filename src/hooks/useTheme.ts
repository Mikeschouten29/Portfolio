import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

export const THEME_KEY = 'portfolio-mike-schouten:theme'

const listeners = new Set<() => void>()

function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

/** Het begin-thema wordt al in index.html gezet, zodat de pagina niet knippert. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'dark' as Theme)

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#f4f6f1' : '#0a0f1a')
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // Opslag niet beschikbaar: het thema geldt dan alleen voor deze sessie.
    }
    listeners.forEach((l) => l())
  }, [])

  return { theme, setTheme, toggle: () => setTheme(theme === 'light' ? 'dark' : 'light') }
}
