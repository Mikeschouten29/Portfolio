import { createContext } from 'react'
import type { PortfolioData } from '../types'

/**
 * local   – Supabase niet ingesteld, alles blijft in deze browser
 * loading – gegevens worden uit Supabase gehaald
 * synced  – gelijk aan wat in Supabase staat
 * saving  – wijzigingen worden naar Supabase gestuurd
 * error   – er ging iets mis (zie message)
 */
export type SyncStatus = 'local' | 'loading' | 'synced' | 'saving' | 'error'

export interface SyncState {
  status: SyncStatus
  message?: string
}

export interface PortfolioContextValue {
  data: PortfolioData
  /** Past de data aan via een recept dat een kopie mag muteren. */
  update: (recipe: (draft: PortfolioData) => void) => void
  replace: (data: PortfolioData) => void
  reset: () => void
  editMode: boolean
  setEditMode: (value: boolean) => void

  /** Is Supabase ingesteld (anon key aanwezig)? */
  cloudEnabled: boolean
  sync: SyncState
  /** E-mailadres van de ingelogde eigenaar, of null. */
  userEmail: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loginOpen: boolean
  setLoginOpen: (open: boolean) => void
}

export const PortfolioContext = createContext<PortfolioContextValue | null>(null)
