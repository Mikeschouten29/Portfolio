import { LU_IDS, type LuId, type Sprint } from '../types'

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function average(values: number[]): number {
  if (values.length === 0) return 0
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
}

/** Hoogst behaalde score van één leeruitkomst: de voortgang die je hebt aangetoond. */
export function luBest(sprints: Sprint[], id: LuId): number {
  return Math.max(0, ...sprints.map((s) => s.learningOutcomes[id]?.score ?? 0))
}

export function sprintLuAverage(sprint: Sprint): number {
  return average(LU_IDS.map((id) => sprint.learningOutcomes[id]?.score ?? 0))
}

export function storyProgress(sprint: Sprint): number {
  if (sprint.userStories.length === 0) return 0
  const done = sprint.userStories.filter((u) => u.done).length
  return Math.round((done / sprint.userStories.length) * 100)
}

export function pageUrl(path: string): string {
  return `${window.location.origin}${window.location.pathname}#/${path}`
}

export function isSafeUrl(url: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(url.trim())
}
