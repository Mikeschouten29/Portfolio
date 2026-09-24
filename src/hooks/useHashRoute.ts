import { useSyncExternalStore } from 'react'

export type PageId = 'home' | 'prompts' | 'show-grow' | 'onderzoek' | 'roadmap' | 'sprints' | 'tijdlijn' | 'dashboard'

export const PAGE_IDS: PageId[] = ['home', 'prompts', 'show-grow', 'onderzoek', 'roadmap', 'sprints', 'tijdlijn', 'dashboard']

export interface Route {
  page: PageId
  param?: string
}

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function getHash() {
  return window.location.hash
}

export function parseHash(hash: string): Route {
  const [page, param] = hash.replace(/^#\/?/, '').split('/')
  if (PAGE_IDS.includes(page as PageId)) return { page: page as PageId, param: param || undefined }
  return { page: 'home' }
}

export function useHashRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash, () => '')
  return parseHash(hash)
}

export function href(page: PageId, param?: string | number): string {
  return `#/${page}${param !== undefined ? `/${param}` : ''}`
}
