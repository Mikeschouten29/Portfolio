import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { sampleData } from '../data/sampleData'
import { loadData, saveData } from '../lib/storage'
import type { PortfolioData } from '../types'
import { PortfolioContext } from './portfolioContext'

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(loadData)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    saveData(data)
  }, [data])

  const update = useCallback((recipe: (draft: PortfolioData) => void) => {
    setData((prev) => {
      const draft = structuredClone(prev)
      recipe(draft)
      return draft
    })
  }, [])

  const replace = useCallback((next: PortfolioData) => setData(next), [])
  const reset = useCallback(() => setData(structuredClone(sampleData)), [])

  const value = useMemo(
    () => ({ data, update, replace, reset, editMode, setEditMode }),
    [data, update, replace, reset, editMode],
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}
