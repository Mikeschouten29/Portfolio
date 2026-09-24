import { createContext } from 'react'
import type { PortfolioData } from '../types'

export interface PortfolioContextValue {
  data: PortfolioData
  /** Past de data aan via een recept dat een kopie mag muteren. */
  update: (recipe: (draft: PortfolioData) => void) => void
  replace: (data: PortfolioData) => void
  reset: () => void
  editMode: boolean
  setEditMode: (value: boolean) => void
}

export const PortfolioContext = createContext<PortfolioContextValue | null>(null)
