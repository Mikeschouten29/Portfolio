import { Copy, ExternalLink, Link2, Plus, Trash2 } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { useCopy } from '../hooks/useCopy'
import { usePortfolio } from '../hooks/usePortfolio'
import { clamp, cn, isSafeUrl, uid } from '../lib/utils'
import type { Link } from '../types'
import { Button, IconButton } from './ui'

type TextTag = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'div'

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  label: string
  multiline?: boolean
  rows?: number
  as?: TextTag
  className?: string
  inputClassName?: string
  placeholder?: string
  /** Tekst die in weergavemodus getoond wordt als het veld leeg is. */
  emptyText?: string
}

export function EditableText({
  value,
  onChange,
  label,
  multiline,
  rows = 3,
  as: Tag = 'p',
  className,
  inputClassName,
  placeholder,
  emptyText,
}: EditableTextProps) {
  const { editMode } = usePortfolio()

  if (editMode) {
    const common = {
      value,
      'aria-label': label,
      placeholder: placeholder ?? label,
      onChange: (e: { target: { value: string } }) => onChange(e.target.value),
      className: cn('field', inputClassName),
    }
    return multiline ? <textarea rows={rows} {...common} /> : <input type="text" {...common} />
  }

  if (!value.trim()) {
    return emptyText ? <p className="text-sm text-muted/80 italic">{emptyText}</p> : null
  }

  return <Tag className={cn(multiline && 'whitespace-pre-line', className)}>{value}</Tag>
}

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="label">
      {children}
    </label>
  )
}

/** Blok met een klein label erboven, dat in weergave- en bewerkmodus hetzelfde oogt. */
export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="label">{label}</p>
      {children}
    </div>
  )
}

interface EditableListProps {
  items: string[]
  onChange: (items: string[]) => void
  label: string
  variant?: 'chips' | 'bullets' | 'numbered'
  emptyText?: string
  addLabel?: string
}

export function EditableList({ items, onChange, label, variant = 'bullets', emptyText, addLabel = 'Toevoegen' }: EditableListProps) {
  const { editMode } = usePortfolio()

  if (editMode) {
    return (
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              className="field"
              value={item}
              aria-label={`${label} ${i + 1}`}
              onChange={(e) => onChange(items.map((it, j) => (j === i ? e.target.value : it)))}
            />
            <IconButton
              icon={Trash2}
              tone="danger"
              label={`${label} ${i + 1} verwijderen`}
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            />
          </div>
        ))}
        <Button size="sm" variant="ghost" icon={Plus} onClick={() => onChange([...items, ''])}>
          {addLabel}
        </Button>
      </div>
    )
  }

  const visible = items.filter((i) => i.trim())
  if (visible.length === 0) {
    return emptyText ? <p className="text-sm text-muted/80 italic">{emptyText}</p> : null
  }

  if (variant === 'chips') {
    return (
      <ul className="flex flex-wrap gap-2" aria-label={label}>
        {visible.map((item, i) => (
          <li key={i} className="rounded-full border border-line bg-surface-2 px-3 py-1 text-sm text-ink">
            {item}
          </li>
        ))}
      </ul>
    )
  }

  if (variant === 'numbered') {
    return (
      <ol className="space-y-3" aria-label={label}>
        {visible.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="font-mono text-sm font-bold text-lime">{String(i + 1).padStart(2, '0')}</span>
            <span className="text-ink/90">{item}</span>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <ul className="space-y-2" aria-label={label}>
      {visible.map((item, i) => (
        <li key={i} className="flex gap-3 text-ink/90">
          <span aria-hidden className="mt-2.5 h-0.5 w-3 shrink-0 bg-lime" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

interface EditableSelectProps<T extends string> {
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  label: string
  children: ReactNode
}

/** Toont `children` in weergavemodus en een keuzelijst in bewerkmodus. */
export function EditableSelect<T extends string>({ value, options, onChange, label, children }: EditableSelectProps<T>) {
  const { editMode } = usePortfolio()
  if (!editMode) return <>{children}</>
  return (
    <select aria-label={label} className="field w-auto py-1.5 text-sm" value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

interface EditableProgressProps {
  value: number
  onChange: (value: number) => void
  label: string
  children: ReactNode
}

/** Toont `children` in weergavemodus en een schuifregelaar (0–100) in bewerkmodus. */
export function EditableProgress({ value, onChange, label, children }: EditableProgressProps) {
  const { editMode } = usePortfolio()
  const id = useId()
  if (!editMode) return <>{children}</>
  return (
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="w-full accent-lime"
      />
      <input
        type="number"
        min={0}
        max={100}
        value={value}
        aria-label={`${label} (getal)`}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="field w-20 px-2 py-1 text-right font-mono text-sm"
      />
    </div>
  )
}

interface LinkListProps {
  links: Link[]
  onChange: (links: Link[]) => void
  label: string
  emptyText?: string
}

export function LinkList({ links, onChange, label, emptyText = 'Nog geen links toegevoegd.' }: LinkListProps) {
  const { editMode } = usePortfolio()
  const copy = useCopy()

  const patch = (id: string, changes: Partial<Link>) =>
    onChange(links.map((l) => (l.id === id ? { ...l, ...changes } : l)))

  if (editMode) {
    return (
      <div className="space-y-3">
        {links.map((link, i) => (
          <div key={link.id} className="grid gap-2 rounded-xl border border-line/70 p-3 sm:grid-cols-[1fr_1.4fr_auto]">
            <input
              className="field"
              value={link.label}
              placeholder="Omschrijving"
              aria-label={`${label} ${i + 1}: omschrijving`}
              onChange={(e) => patch(link.id, { label: e.target.value })}
            />
            <input
              className="field font-mono text-sm"
              type="url"
              value={link.url}
              placeholder="https://…"
              aria-label={`${label} ${i + 1}: URL`}
              onChange={(e) => patch(link.id, { url: e.target.value })}
            />
            <IconButton
              icon={Trash2}
              tone="danger"
              label={`${label} ${i + 1} verwijderen`}
              onClick={() => onChange(links.filter((l) => l.id !== link.id))}
            />
          </div>
        ))}
        <Button
          size="sm"
          variant="ghost"
          icon={Plus}
          onClick={() => onChange([...links, { id: uid('link'), label: '', url: 'https://' }])}
        >
          Link toevoegen
        </Button>
      </div>
    )
  }

  const visible = links.filter((l) => l.url.trim() && isSafeUrl(l.url))
  if (visible.length === 0) return <p className="text-sm text-muted/80 italic">{emptyText}</p>

  return (
    <ul className="space-y-2" aria-label={label}>
      {visible.map((link) => (
        <li key={link.id} className="flex items-center gap-2">
          <Link2 className="size-4 shrink-0 text-data" aria-hidden />
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-w-0 items-center gap-1.5 text-sm text-ink underline decoration-line underline-offset-4 hover:text-lime hover:decoration-lime"
          >
            <span className="truncate">{link.label || link.url}</span>
            <ExternalLink className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100" aria-hidden />
            <span className="sr-only">(opent in nieuw tabblad)</span>
          </a>
          <IconButton icon={Copy} label={`Link "${link.label || link.url}" kopiëren`} onClick={() => copy(link.url, 'Link gekopieerd')} className="size-8" />
        </li>
      ))}
    </ul>
  )
}
