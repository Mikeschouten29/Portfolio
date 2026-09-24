import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clamp, cn } from '../lib/utils'
import type { Priority, SprintStatus } from '../types'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: LucideIcon
  size?: 'sm' | 'md'
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-lime text-lime-dark hover:brightness-110 font-semibold',
  outline: 'border border-line bg-surface/60 text-ink hover:border-lime/60 hover:text-lime',
  ghost: 'text-muted hover:bg-ink/5 hover:text-ink',
  danger: 'border border-danger/40 text-danger hover:bg-danger/10',
}

export function Button({ variant = 'outline', icon: Icon, size = 'md', className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        size === 'md' ? 'px-4 py-2 text-sm' : 'px-2.5 py-1.5 text-xs',
        buttonVariants[variant],
        className,
      )}
      {...rest}
    >
      {Icon && <Icon className={size === 'md' ? 'size-4' : 'size-3.5'} aria-hidden />}
      {children}
    </button>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  label: string
  tone?: 'default' | 'danger'
}

export function IconButton({ icon: Icon, label, tone = 'default', className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-transparent transition-colors',
        tone === 'default' && 'text-muted hover:border-line hover:bg-surface-2 hover:text-lime',
        tone === 'danger' && 'text-danger/80 hover:border-danger/40 hover:bg-danger/10 hover:text-danger',
        className,
      )}
      {...rest}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  )
}

export function Card({ children, className, as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'article' | 'section' | 'li' }) {
  return (
    <Tag className={cn('rounded-2xl border border-line bg-surface/80 p-5 backdrop-blur-sm sm:p-6', className)}>
      {children}
    </Tag>
  )
}

type BadgeTone = 'lime' | 'data' | 'flame' | 'neutral' | 'danger'

const badgeTones: Record<BadgeTone, string> = {
  lime: 'border-lime/30 bg-lime/10 text-lime',
  data: 'border-data/30 bg-data/10 text-data',
  flame: 'border-flame/30 bg-flame/10 text-flame',
  danger: 'border-danger/30 bg-danger/10 text-danger',
  neutral: 'border-line bg-surface-2 text-muted',
}

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide',
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: SprintStatus }) {
  const tone: BadgeTone = status === 'Afgerond' ? 'lime' : status === 'Bezig' ? 'data' : 'neutral'
  return (
    <Badge tone={tone}>
      <span
        aria-hidden
        className={cn(
          'size-1.5 rounded-full',
          status === 'Afgerond' && 'bg-lime',
          status === 'Bezig' && 'animate-pulse bg-data',
          status === 'Gepland' && 'bg-muted',
        )}
      />
      {status}
    </Badge>
  )
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const tone: BadgeTone = priority === 'Hoog' ? 'flame' : priority === 'Middel' ? 'data' : 'neutral'
  return <Badge tone={tone}>Prioriteit: {priority}</Badge>
}

export function ProgressBar({
  value,
  label,
  tone = 'lime',
  className,
}: {
  value: number
  label: string
  tone?: 'lime' | 'data' | 'flame'
  className?: string
}) {
  const v = clamp(value)
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-ink/[0.06]', className)}
    >
      <motion.div
        className={cn(
          'h-full rounded-full',
          tone === 'lime' && 'bg-lime',
          tone === 'data' && 'bg-data',
          tone === 'flame' && 'bg-flame',
        )}
        initial={{ width: 0 }}
        whileInView={{ width: `${v}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

export function EmptyState({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line px-6 py-12 text-center">
      <Icon className="size-8 text-muted" aria-hidden />
      <p className="font-display text-xl font-semibold">{title}</p>
      {children && <div className="max-w-md text-sm text-muted">{children}</div>}
    </div>
  )
}

/** Fade-in bij scrollen: subtiel en zonder opdringerige beweging. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
