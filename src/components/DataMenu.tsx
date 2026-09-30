import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Cloud, CloudAlert, CloudOff, Database, FileDown, FileUp, LoaderCircle, LogIn, LogOut, RotateCcw, type LucideIcon } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react'
import type { SyncState } from '../context/portfolioContext'
import { usePortfolio } from '../hooks/usePortfolio'
import { useToast } from '../hooks/useToast'
import { downloadJson, readJsonFile } from '../lib/storage'
import { cn } from '../lib/utils'
import { ConfirmDialog } from './ConfirmDialog'
import { Button } from './ui'

interface MenuAction {
  icon: LucideIcon
  label: string
  onClick: () => void
  danger?: boolean
}

const syncView = {
  local: { icon: CloudOff, dot: 'bg-muted', text: 'Alleen in deze browser (Supabase niet ingesteld)' },
  loading: { icon: LoaderCircle, dot: 'bg-data animate-pulse', text: 'Gegevens ophalen uit Supabase…' },
  synced: { icon: Cloud, dot: 'bg-lime', text: 'Gelijk met Supabase' },
  saving: { icon: LoaderCircle, dot: 'bg-data animate-pulse', text: 'Opslaan in Supabase…' },
  error: { icon: CloudAlert, dot: 'bg-danger', text: 'Probleem met Supabase' },
} as const

function SyncInfo({ sync, userEmail, cloudEnabled }: { sync: SyncState; userEmail: string | null; cloudEnabled: boolean }) {
  const v = syncView[sync.status]
  return (
    <div className="rounded-lg border border-line/70 bg-bg/40 px-3 py-2 text-xs" role="status">
      <p className={cn('flex items-center gap-1.5 font-medium', sync.status === 'error' ? 'text-danger' : 'text-ink')}>
        <v.icon className={cn('size-3.5 shrink-0', (sync.status === 'loading' || sync.status === 'saving') && 'animate-spin')} aria-hidden />
        {v.text}
      </p>
      {sync.message && <p className="mt-1 text-danger">{sync.message}</p>}
      {cloudEnabled && (
        <p className="mt-1 truncate text-muted">{userEmail ? `Ingelogd als ${userEmail}` : 'Niet ingelogd: wijzigingen blijven lokaal'}</p>
      )}
    </div>
  )
}

/** Exporteren, importeren en resetten van alle portfoliogegevens, plus inloggen voor Supabase. */
export function DataMenu({ inline = false, onAction }: { inline?: boolean; onAction?: () => void }) {
  const { data, replace, reset, sync, cloudEnabled, userEmail, setLoginOpen, signOut } = usePortfolio()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const fileId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleExport = () => {
    downloadJson(data)
    toast('JSON-bestand gedownload')
    setOpen(false)
    onAction?.()
  }

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      replace(await readJsonFile(file))
      toast('Gegevens geïmporteerd')
      onAction?.()
    } catch (err) {
      toast(err instanceof Error ? `Importeren mislukt: ${err.message}` : 'Importeren mislukt', 'error')
    }
    setOpen(false)
  }

  const account: MenuAction[] = cloudEnabled
    ? [
        userEmail
          ? {
              icon: LogOut,
              label: 'Uitloggen',
              onClick: () => {
                void signOut().then(() => toast('Uitgelogd', 'info'))
                setOpen(false)
                onAction?.()
              },
            }
          : {
              icon: LogIn,
              label: 'Inloggen',
              onClick: () => {
                setOpen(false)
                onAction?.()
                setLoginOpen(true)
              },
            },
      ]
    : []

  const actions: MenuAction[] = [
    ...account,
    { icon: FileDown, label: 'JSON exporteren', onClick: handleExport },
    { icon: FileUp, label: 'JSON importeren', onClick: () => document.getElementById(fileId)?.click() },
    {
      icon: RotateCcw,
      label: 'Gegevens resetten',
      danger: true,
      onClick: () => {
        setOpen(false)
        setConfirmReset(true)
      },
    },
  ]

  return (
    <div ref={wrapRef} className={cn(!inline && 'relative')}>
      <input id={fileId} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} onChange={handleImport} aria-hidden />

      {inline ? (
        <div className="grid gap-2">
          <SyncInfo sync={sync} userEmail={userEmail} cloudEnabled={cloudEnabled} />
          {actions.map((a) => (
            <Button key={a.label} icon={a.icon} variant={a.danger ? 'danger' : 'outline'} onClick={a.onClick} className="justify-start">
              {a.label}
            </Button>
          ))}
        </div>
      ) : (
        <>
          <Button icon={Database} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" className="relative">
            Data
            <span className={cn('absolute top-1.5 left-6 size-2 rounded-full ring-2 ring-bg', syncView[sync.status].dot)} aria-hidden />
            <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
          </Button>
          <AnimatePresence>
            {open && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-surface-2 p-1.5 shadow-2xl shadow-black/50"
              >
                <div className="mb-1">
                  <SyncInfo sync={sync} userEmail={userEmail} cloudEnabled={cloudEnabled} />
                </div>
                {actions.map((a) => (
                  <button
                    key={a.label}
                    role="menuitem"
                    type="button"
                    onClick={a.onClick}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                      a.danger ? 'text-danger hover:bg-danger/10' : 'text-ink hover:bg-ink/5',
                    )}
                  >
                    <a.icon className="size-4" aria-hidden />
                    {a.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="Gegevens resetten?"
        message={`Al je wijzigingen worden gewist en de voorbeelddata wordt teruggezet${userEmail ? ', ook in Supabase' : ''}. Exporteer eerst een JSON-back-up als je je werk wilt bewaren.`}
        confirmLabel="Ja, resetten"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          reset()
          setConfirmReset(false)
          toast('Gegevens teruggezet naar de voorbeelddata', 'info')
          onAction?.()
        }}
      />
    </div>
  )
}
