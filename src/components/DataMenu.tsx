import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Database, FileDown, FileUp, RotateCcw } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react'
import { usePortfolio } from '../hooks/usePortfolio'
import { useToast } from '../hooks/useToast'
import { downloadJson, readJsonFile } from '../lib/storage'
import { cn } from '../lib/utils'
import { ConfirmDialog } from './ConfirmDialog'
import { Button } from './ui'

/** Exporteren, importeren en resetten van alle portfoliogegevens. */
export function DataMenu({ inline = false, onAction }: { inline?: boolean; onAction?: () => void }) {
  const { data, replace, reset } = usePortfolio()
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

  const actions = [
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
          {actions.map((a) => (
            <Button key={a.label} icon={a.icon} variant={a.danger ? 'danger' : 'outline'} onClick={a.onClick} className="justify-start">
              {a.label}
            </Button>
          ))}
        </div>
      ) : (
        <>
          <Button icon={Database} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu">
            Data
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
                className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-surface-2 p-1.5 shadow-2xl shadow-black/50"
              >
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
        message="Al je wijzigingen worden gewist en de voorbeelddata wordt teruggezet. Exporteer eerst een JSON-back-up als je je werk wilt bewaren."
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
