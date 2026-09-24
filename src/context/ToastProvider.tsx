import { AnimatePresence, motion } from 'motion/react'
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '../lib/utils'
import { ToastContext, type Toast, type ToastKind } from './toastContext'

const icons = { success: CircleCheck, error: CircleAlert, info: Info }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, kind: ToastKind = 'success') => {
      const id = nextId.current++
      setToasts((list) => [...list.slice(-3), { id, kind, message }])
      window.setTimeout(() => dismiss(id), 3500)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = icons[t.kind]
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className={cn(
                  'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border bg-surface-2 px-4 py-3 text-sm shadow-2xl shadow-black/40',
                  t.kind === 'success' && 'border-lime/40',
                  t.kind === 'error' && 'border-danger/50',
                  t.kind === 'info' && 'border-data/40',
                )}
              >
                <Icon
                  aria-hidden
                  className={cn(
                    'size-5 shrink-0',
                    t.kind === 'success' && 'text-lime',
                    t.kind === 'error' && 'text-danger',
                    t.kind === 'info' && 'text-data',
                  )}
                />
                <p className="flex-1 text-ink">{t.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="rounded-md p-1 text-muted hover:bg-ink/5 hover:text-ink"
                  aria-label="Melding sluiten"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
