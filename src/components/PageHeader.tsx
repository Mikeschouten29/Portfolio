import type { LucideIcon } from 'lucide-react'
import { Link2 } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useCopy } from '../hooks/useCopy'
import { pageUrl } from '../lib/utils'
import { Button } from './ui'

interface PageHeaderProps {
  icon: LucideIcon
  kicker: string
  title: string
  description?: ReactNode
  /** Pad achter `#/` voor de directe link, bijv. `sprints/3`. */
  path: string
  actions?: ReactNode
}

export function PageHeader({ icon: Icon, kicker, title, description, path, actions }: PageHeaderProps) {
  const copy = useCopy()
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mb-8 flex flex-col gap-5 border-b border-line pb-8 sm:mb-10 md:flex-row md:items-end md:justify-between"
    >
      <div className="max-w-2xl">
        <p className="kicker mb-3 flex items-center gap-2">
          <Icon className="size-4" aria-hidden />
          {kicker}
        </p>
        <h1 className="text-5xl leading-[0.95] font-bold uppercase sm:text-6xl">{title}</h1>
        {description && <div className="mt-4 text-base text-muted sm:text-lg">{description}</div>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        <Button icon={Link2} onClick={() => copy(pageUrl(path), 'Directe link gekopieerd')}>
          Kopieer link
        </Button>
      </div>
    </motion.header>
  )
}

export function SectionTitle({ icon: Icon, children, id }: { icon?: LucideIcon; children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mb-4 flex items-center gap-2.5 text-2xl font-bold uppercase sm:text-3xl">
      {Icon && <Icon className="size-5 text-lime" aria-hidden />}
      {children}
    </h2>
  )
}
