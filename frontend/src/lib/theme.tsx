import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

export type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: 'class'
  defaultTheme?: Theme
  enableSystem?: boolean
}

type ThemeContextValue = {
  theme?: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => {},
})

const getSystemTheme = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme | undefined>(undefined)

  useEffect(() => {
    const storedTheme = (typeof window !== 'undefined' && localStorage.getItem('theme')) as Theme | null
    const initial = storedTheme ?? defaultTheme
    const resolved = initial === 'system' && enableSystem ? getSystemTheme() : initial

    updateDocumentTheme(resolved, attribute)
    setThemeState(resolved)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onMediaChange = (event: MediaQueryListEvent) => {
      if ((storedTheme ?? defaultTheme) === 'system' && enableSystem) {
        const next = event.matches ? 'dark' : 'light'
        updateDocumentTheme(next, attribute)
        setThemeState(next)
      }
    }

    media.addEventListener('change', onMediaChange)
    return () => media.removeEventListener('change', onMediaChange)
  }, [attribute, defaultTheme, enableSystem])

  const setTheme = (value: Theme) => {
    const resolved = value === 'system' && enableSystem ? getSystemTheme() : value
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', value)
    }
    updateDocumentTheme(resolved, attribute)
    setThemeState(resolved)
  }

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: theme ?? (enableSystem ? 'system' : defaultTheme), setTheme }),
    [defaultTheme, enableSystem, theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

function updateDocumentTheme(theme: Theme, attribute: 'class') {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  if (attribute === 'class') {
    root.classList.remove('light', 'dark')
    root.classList.add(theme === 'system' ? getSystemTheme() : theme)
  }

  root.style.colorScheme = theme === 'dark' ? 'dark' : 'light'
}
