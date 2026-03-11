import { useSyncExternalStore } from 'react'

const getSnapshot = () => (typeof window === 'undefined' ? '/' : window.location.pathname)

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {}

  const handler = () => callback()
  window.addEventListener('popstate', handler)
  window.addEventListener('spa:navigate', handler)
  return () => {
    window.removeEventListener('popstate', handler)
    window.removeEventListener('spa:navigate', handler)
  }
}

export function usePathname() {
  return useSyncExternalStore(subscribe, getSnapshot, () => '/')
}
