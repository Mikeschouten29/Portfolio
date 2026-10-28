import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { cn } from '../lib/utils'

interface ExpandableProps {
  /** Altijd zichtbare kop */
  title: ReactNode
  /** Korte regel onder de titel (blijft zichtbaar) */
  teaser?: ReactNode
  /** Rechts in de kop, bijv. een badge */
  aside?: ReactNode
  children: ReactNode
  /** Standaard open */
  defaultOpen?: boolean
  /** Altijd open (bijv. in de bewerkmodus) */
  forceOpen?: boolean
  className?: string
}

/** Inklapbaar blok: kop en korte regel zichtbaar, details na een klik. */
export function Expandable({ title, teaser, aside, children, defaultOpen = false, forceOpen = false, className }: ExpandableProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()
  const isOpen = forceOpen || open

  return (
    <div className={cn('rounded-xl border bg-bg/40 transition-colors', isOpen ? 'border-lime/40' : 'border-line hover:border-lime/30', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        disabled={forceOpen}
        className="flex w-full items-start gap-3 p-4 text-left disabled:cursor-default"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-ink">{title}</span>
          {teaser && <span className="mt-0.5 block text-sm text-muted">{teaser}</span>}
        </span>
        {aside && <span className="shrink-0">{aside}</span>}
        {!forceOpen && (
          <ChevronDown className={cn('mt-0.5 size-5 shrink-0 text-muted transition-transform', isOpen && 'rotate-180 text-lime')} aria-hidden />
        )}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-line/70 px-4 pt-3 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
