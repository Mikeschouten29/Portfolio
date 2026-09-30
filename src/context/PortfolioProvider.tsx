import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { sampleData } from '../data/sampleData'
import { isPortfolioData, loadData, migrate, saveData } from '../lib/storage'
import { cloudEnabled, fetchRemote, saveRemote, supabase } from '../lib/supabase'
import type { PortfolioData } from '../types'
import { PortfolioContext, type SyncState } from './portfolioContext'

/** Hoe lang na de laatste wijziging we naar Supabase opslaan (minder verzoeken tijdens typen). */
const SAVE_DELAY_MS = 800

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(loadData)
  const [editMode, setEditMode] = useState(false)
  const [sync, setSync] = useState<SyncState>({ status: cloudEnabled ? 'loading' : 'local' })
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  // Pas opslaan naar Supabase nadat de online versie is opgehaald, anders overschrijven we die.
  const [remoteReady, setRemoteReady] = useState(!cloudEnabled)
  // JSON van de laatst bekende online versie, om dubbele opslag te voorkomen.
  const lastSynced = useRef<string | null>(null)

  // Altijd ook lokaal bewaren: werkt offline en als reservekopie.
  useEffect(() => {
    saveData(data)
  }, [data])

  // Bij het openen: sessie herstellen en de online versie ophalen.
  useEffect(() => {
    if (!supabase) return
    let cancelled = false

    void supabase.auth.getSession().then(({ data: s }) => {
      if (!cancelled) setUserEmail(s.session?.user.email ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null)
    })

    fetchRemote()
      .then((remote) => {
        if (cancelled) return
        if (remote && isPortfolioData(remote)) {
          const next = migrate(remote)
          lastSynced.current = JSON.stringify(next)
          setData(next)
        }
        setSync({ status: 'synced' })
      })
      .catch((err: unknown) => {
        if (!cancelled) setSync({ status: 'error', message: err instanceof Error ? err.message : String(err) })
      })
      .finally(() => {
        if (!cancelled) setRemoteReady(true)
      })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  // Wijzigingen van de ingelogde eigenaar automatisch naar Supabase sturen.
  useEffect(() => {
    if (!supabase || !userEmail || !remoteReady) return
    const json = JSON.stringify(data)
    if (json === lastSynced.current) return

    const timer = window.setTimeout(() => {
      setSync({ status: 'saving' })
      saveRemote(data)
        .then(() => {
          lastSynced.current = json
          setSync({ status: 'synced' })
        })
        .catch((err: unknown) => setSync({ status: 'error', message: err instanceof Error ? err.message : String(err) }))
    }, SAVE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [data, userEmail, remoteReady])

  const update = useCallback((recipe: (draft: PortfolioData) => void) => {
    setData((prev) => {
      const draft = structuredClone(prev)
      recipe(draft)
      return draft
    })
  }, [])

  const replace = useCallback((next: PortfolioData) => setData(next), [])
  const reset = useCallback(() => setData(structuredClone(sampleData)), [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase is nog niet ingesteld.')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(/invalid login/i.test(error.message) ? 'E-mailadres of wachtwoord klopt niet.' : error.message)
  }, [])

  const signOut = useCallback(async () => {
    setEditMode(false)
    await supabase?.auth.signOut()
  }, [])

  const value = useMemo(
    () => ({
      data,
      update,
      replace,
      reset,
      editMode,
      setEditMode,
      cloudEnabled,
      sync,
      userEmail,
      signIn,
      signOut,
      loginOpen,
      setLoginOpen,
    }),
    [data, update, replace, reset, editMode, sync, userEmail, signIn, signOut, loginOpen],
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}
